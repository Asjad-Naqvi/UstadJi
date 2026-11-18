import { Injectable, BadRequestException, ConflictException, ForbiddenException, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ProvidersService } from '../providers/providers.service';
import { BookingsService } from '../bookings/bookings.service';
import { agentPrompt, usableReply, isGreeting, cleanGreeting } from './agent-prompt';
import { extractUnderstanding, Understanding, normalize } from './understanding';
import { localDate, resolveDate, resolveTime, resolveProvider, matchesTime, TimePreference } from './booking-understanding';
export { localDate } from './booking-understanding';

type Action = {sessionId?:string;revision?:number;message?:string;providerId?:string;startTime?:string;endTime?:string;confirm?:boolean};
type Field = 'understanding'|'service'|'date'|'provider'|'time';
type Session = {
  owner:string; revision:number; updated:number; busy:boolean;
  history:{role:string;content:string}[]; category?:string; issue?:string; date?:string;
  providerId?:string; providerReference?:string; offeredProviders?:string[];
  timePreference?:TimePreference; slot?:{startTime:string;endTime:string};
  pending:Partial<Record<Field,string>>; lastSummary?:string; submitted?:boolean; result?:any;
};
const TRADES:Record<string,string> = {Plumbing:'plumb',Electrical:'electric','AC Repair':'ac',Carpentry:'carpent',Cleaning:'clean'};
export function dateFromText(text:string, today=localDate()) {
  const result=resolveDate(text,today);
  if(result.clarification)throw new BadRequestException(result.clarification);
  return result.value;
}

@Injectable()
export class AgentService {
  private sessions=new Map<string,Session>();
  constructor(private prisma:PrismaService, private providers:ProvidersService, private bookings:BookingsService) {}
  private get(id:string,owner:string) {
    const s=this.sessions.get(id);
    if(!s||s.owner!==owner||Date.now()-s.updated>30*60*1000)throw new BadRequestException('Chat expire ho gayi. Nayi chat shuru karein.');
    return s;
  }
  async act(owner:string,body:Action) {
    for(const [id,s] of this.sessions)if(Date.now()-s.updated>30*60*1000&&!s.busy)this.sessions.delete(id);
    const user=await this.prisma.user.findUnique({where:{id:owner},include:{customerProfile:true}});
    if(!user||user.role!=='CUSTOMER')throw new ForbiddenException('Customer login zaroori hai.');
    if(body.message&&(body.confirm||body.providerId||body.startTime||body.endTime))throw new BadRequestException('Message aur booking action alag bhejein.');
    if(body.confirm&&(body.providerId||body.startTime||body.endTime))throw new BadRequestException('Confirmation ke saath details change nahi kar sakte.');
    let id=body.sessionId;
    if(!id) {
      if(body.confirm||body.providerId||body.startTime||body.endTime)throw new BadRequestException('Pehle chat shuru karein.');
      if(this.sessions.size>=500)throw new ServiceUnavailableException('Abhi server busy hai.');
      id=randomUUID();this.sessions.set(id,{owner,revision:0,updated:Date.now(),busy:false,history:[],pending:{}});
    }
    const stored=this.get(id,owner);
    if(stored.busy)throw new ConflictException('Pichli request abhi chal rahi hai.');
    if(body.revision!==undefined&&body.revision!==stored.revision)throw new ConflictException('Chat badal gayi hai. Latest details dobara dekhein.');
    if(stored.result)return {...stored.result,sessionId:id,revision:stored.revision};
    if(stored.submitted)throw new ConflictException('Pichli booking ka outcome verify karein; dobara submit nahi kar sakte.');
    stored.busy=true;
    // Work on a copy so a rejected action cannot silently modify the saved draft.
    const s:Session={...stored,history:[...stored.history],pending:{...stored.pending}};
    try {
      const profile=user.customerProfile;
      const sector=profile?.sector?.split('/')[0];
      if(!sector||!profile?.address)throw new BadRequestException('Pehle profile mein service address aur sector save karein.');
      let modelAvailable=true;
      let extractionAvailable=true;
      let proposal:Understanding|undefined;
      if(body.message?.trim()) {
        try {
          proposal=await extractUnderstanding(body.message,{category:s.category,date:s.date,issue:s.issue,time:s.timePreference?.kind==='exact'?s.timePreference.startTime:undefined});
          if(['cancel','reschedule','status'].includes(proposal.intent)) {
            s.pending.understanding='Maujooda booking ka status, cancellation ya reschedule abhi My Bookings se karein. Is draft ko jari rakhna ho to booking details dobara batayein.';
          } else if(proposal.unclear) {
            s.pending.understanding='Ek waqt mein ek service ki booking karte hain. Kis masle ke liye visit chahiye?';
          } else if(!['create','correct'].includes(proposal.intent)&&(resolveDate(body.message).mentioned||/\b(?:baj[ey]|subah|shaam|sham|nahi|nahin|bajaye|jagah|badal|change|instead|doosra|dusra|\d{1,2}:\d{2})\b/i.test(body.message))) {
            s.pending.understanding='Kya aap booking ki koi detail badalna chahte hain? Nayi date, waqt ya ustad saaf bata dein.';
          } else if(proposal.intent==='create'||proposal.intent==='correct') {
            delete s.pending.understanding;
            const hasChanges=proposal.category||proposal.issueText||proposal.dateText||proposal.timeText||proposal.providerText;
            if(!hasChanges)s.pending.understanding='Kaunsi detail badalni hai? Service, date, ustad ya waqt bata dein.';
            if(proposal.category) {
              if(proposal.category!==s.category) {
                s.category=proposal.category;s.issue=undefined;s.providerId=undefined;s.slot=undefined;s.offeredProviders=[];
                delete s.pending.provider;delete s.pending.service;
              }
              delete s.pending.service;
            }
            if(proposal.issueText&&s.category) {
              const detail=proposal.issueText.trim();
              if(proposal.intent==='correct'||!s.issue)s.issue=detail;
              else if(!s.issue.includes(detail))s.issue=(s.issue+'; '+detail).slice(-1500);
            }
            // Parse the current utterance first: a model cannot select the negated old date.
            const rawDate=resolveDate(body.message);
            // Small models sometimes copy a time phrase into both fields. The server
            // recognizes this overlap; an explicit time-only edit cannot erase a date.
            const timeOnlyDate=proposal.dateText&&proposal.timeText&&!rawDate.mentioned&&
              ((' '+normalize(proposal.timeText)+' ').includes(' '+normalize(proposal.dateText)+' ')||(' '+normalize(proposal.dateText)+' ').includes(' '+normalize(proposal.timeText)+' '));
            if(proposal.dateText&&!timeOnlyDate) {
              const date=rawDate.mentioned?rawDate:resolveDate(proposal.dateText);
              if(date.value) {
                if(date.value!==s.date){s.date=date.value;s.slot=undefined;}
                delete s.pending.date;
              } else {s.date=undefined;s.slot=undefined;s.pending.date=date.clarification||'Visit ki exact date YYYY-MM-DD mein bata dein.';}
            }
            const hasTimeSignal=/\b(?:baj[ey]|subah|shaam|sham|raat|dopahar|am|pm|morning|evening|night|\d{1,2}:\d{2})\b/i.test(body.message);
            const dateOnlyTime=proposal.timeText&&rawDate.mentioned&&!hasTimeSignal&&resolveDate(proposal.timeText).mentioned;
            if(proposal.timeText&&!dateOnlyTime) {
              // Include the whole correction so the model cannot choose its negated old time.
              const timeSource=/\b(?:baj[ey]|subah|shaam|sham|am|pm|\d{1,2}:\d{2})\b/i.test(body.message)?body.message.replace(/\b20\d{2}-\d{2}-\d{2}\b/g,''):proposal.timeText;
              const time=resolveTime(timeSource,s.timePreference);
              s.slot=undefined;
              if(time.value){s.timePreference=time.value;delete s.pending.time;}
              else {s.timePreference=undefined;s.pending.time=time.clarification;}
            } else if(/\b(?:baj[ey]|subah|shaam|sham|\d{1,2}:\d{2})\b/i.test(body.message)) {
              s.slot=undefined;s.timePreference=undefined;s.pending.time='Waqt clear nahi hua. Subah/shaam ke saath ya HH:mm mein bata dein.';
            }
            if(proposal.providerText) {
              s.providerReference=proposal.providerText;s.providerId=undefined;s.slot=undefined;
            }
          }
        } catch {
          modelAvailable=false;extractionAvailable=false;
          s.pending.understanding='Details samajhne mein masla hua. Apni service, date ya correction dobara saaf likhein; pichli details par request submit nahi hui.';
        }
        s.history.push({role:'user',content:body.message});s.history=s.history.slice(-10);
      }
      const availableProviders=s.category?(await this.providers.findAll(undefined,sector)).filter(p=>{
        const trade=p.providerProfile?.trade.toLowerCase()||'';
        const covered=(p.providerProfile?.sectorsCovered||'').split(',').map(v=>v.trim().split('/')[0].toUpperCase());
        return p.providerProfile?.isVerified&&covered.includes(sector.toUpperCase())&&(s.category==='AC Repair'?/\bac\b|hvac/.test(trade):trade.includes(TRADES[s.category]));
      }).map(p=>({id:p.id,name:p.fullName,trade:p.providerProfile.trade,estimatedHourlyRate:p.providerProfile.hourlyRate})):[];
      if(s.providerId&&!availableProviders.some(p=>p.id===s.providerId)) {s.providerId=undefined;s.slot=undefined;}
      if(s.providerReference&&s.category) {
        const selected=resolveProvider(s.providerReference,availableProviders,s.offeredProviders);
        if(selected.value){s.providerId=selected.value;delete s.pending.provider;}
        else s.pending.provider=selected.clarification;
        s.providerReference=undefined;
      }
      if(body.providerId) {
        if(!availableProviders.some(p=>p.id===body.providerId))throw new BadRequestException('Provider is service/area mein available nahi.');
        if(s.providerId!==body.providerId)s.slot=undefined;
        s.providerId=body.providerId;delete s.pending.provider;
      }
      let slots=s.providerId&&s.date?(await this.bookings.getAvailableSlots(s.providerId,s.date)).filter(v=>v.isAvailable&&!v.isLocked):[];
      if(s.date===localDate()) {
        const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
        slots=slots.filter(v=>v.startTime>time);
      }
      if(s.slot&&!slots.some(v=>v.startTime===s.slot.startTime&&v.endTime===s.slot.endTime))s.slot=undefined;
      if(body.startTime||body.endTime) {
        const slot=slots.find(v=>v.startTime===body.startTime&&v.endTime===body.endTime);
        if(!slot)throw new BadRequestException('Ye slot ab available nahi.');
        s.slot={startTime:slot.startTime,endTime:slot.endTime};s.timePreference={kind:'exact',startTime:slot.startTime};delete s.pending.time;
      } else if(s.timePreference?.kind==='exact'&&!s.pending.time) {
        const slot=slots.find(v=>matchesTime(v.startTime,s.timePreference));
        if(slot)s.slot={startTime:slot.startTime,endTime:slot.endTime};
      }
      const provider=availableProviders.find(p=>p.id===s.providerId);
      const clarification=Object.values(s.pending).find(Boolean);
      const summary=!clarification&&provider&&s.slot&&s.date&&s.issue?`${s.issue} | ${provider.name} | ${s.date} | ${s.slot.startTime}–${s.slot.endTime} | ${profile.address}, ${sector}, ${profile.city}`:null;
      if(body.confirm) {
        if(summary!==s.lastSummary)throw new ConflictException('Booking details badal gayi hain; dobara review karein.');
        if(body.revision===undefined||!summary||!s.category||!slots.some(v=>v.startTime===s.slot.startTime&&v.endTime===s.slot.endTime))throw new BadRequestException('Latest provider, slot aur summary pehle select karein.');
        const simulated=process.env.AGENT_SIMULATE_BOOKINGS==='true';
        if(!simulated&&process.env.AGENT_ALLOW_BOOKINGS!=='true')throw new ForbiddenException('Booking writes disabled hain; AGENT_ALLOW_BOOKINGS enable karna hoga.');
        stored.submitted=true;s.submitted=true; // Keep uncertain mutation outcomes blocked even if the downstream call fails.
        const booking=simulated?{id:randomUUID(),bookingCode:'SIM-'+randomUUID().slice(0,8).toUpperCase(),status:'SIMULATED'}:await this.bookings.createBooking({customerId:owner,providerId:s.providerId,serviceCategory:s.category,issueDescription:`${s.issue}\nService address: ${profile.address}, ${sector}, ${profile.city}`,appointmentDate:s.date,...s.slot});
        s.result={reply:simulated?`Test booking ${booking.bookingCode} tayyar ho gayi. Ye sirf simulation hai; kisi ustad ko request nahi bheji gayi.`:booking.status==='SCHEDULED'?`Booking ${booking.bookingCode} confirm ho gayi.`:`Request ${booking.bookingCode} bhej di; provider ki acceptance ka intezar hai.`,booking:{id:booking.id,bookingCode:booking.bookingCode,status:booking.status},simulated,providers:[],slots:[],summary:null};
        s.updated=Date.now();s.revision++;s.busy=false;this.sessions.set(id,s);
        return {...s.result,sessionId:id,revision:s.revision};
      }
      let stage='COLLECT_ISSUE';
      let reply='Ghar mein kis cheez ka masla hai?';
      if(s.category&&!s.issue)reply='Is service ke liye kya masla theek karwana hai?';
      else if(s.issue&&s.category) {
        if(!s.date){stage='COLLECT_DATE';reply='Visit kis din chahiye? Kal, parson ya YYYY-MM-DD bata sakte hain.';}
        else if(!availableProviders.length){stage='UNAVAILABLE';reply='Aap ke saved area mein is service ka verified ustad nahi mila.';}
        else if(!provider){stage='CHOOSE_PROVIDER';reply='Kis ustad ko bulana hai? Neeche card select karein ya naam likhein.';}
        else if(!slots.length){stage='UNAVAILABLE';reply='Is date par available slot nahi mila. Doosri date likhein.';}
        else if(summary){stage='REVIEW';reply='Ustad, date, waqt aur address neeche check kar lein. Sahi hon to Confirm request dabayein.';}
        else {stage='CHOOSE_SLOT';reply='Kis waqt visit chahiye? Subah/shaam ke saath likhein ya neeche slot select karein.';}
      }
      if(clarification){stage='CLARIFY';reply=clarification;}
      const preferredSlots=slots.filter(v=>matchesTime(v.startTime,s.timePreference));
      const offeredSlots=s.timePreference?.kind==='period'&&preferredSlots.length?preferredSlots:slots;
      if(!clarification&&provider&&s.date&&slots.length&&s.timePreference&&!s.slot) {
        reply=s.timePreference.kind==='exact'?`${s.timePreference.startTime} ka slot available nahi. Neeche se doosra waqt select karein.`:preferredSlots.length?'Aap ki pasand ke waqt ke slots neeche hain. Ek select kar lein.':'Is waqt ke mutabiq slot nahi mila. Neeche se doosra waqt select karein.';
      }
      // Transactional replies are grounded in backend state; casual turns can use natural generation.
      // Avoid a second CPU inference for every booking update.
      if(body.message&&modelAvailable&&!clarification&&!summary&&proposal&&['greet','help','other'].includes(proposal.intent)) {
        try {
          const response=await fetch((process.env.OLLAMA_BASE_URL||'http://127.0.0.1:11434')+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(90000),body:JSON.stringify({model:process.env.OLLAMA_MODEL||'qwen3.5:2b-q4_K_M',think:false,stream:false,messages:[{role:'system',content:agentPrompt({category:s.category,date:s.date,sector,nextStep:reply,userGreeted:isGreeting(body.message)})},...s.history],options:{num_ctx:2048,num_batch:64,num_predict:100,temperature:0.3}})});
          if(!response.ok)throw new Error('Ollama unavailable');
          const data:any=await response.json();const text=data.message?.content;
          const cleaned=typeof text==='string'?cleanGreeting(text,body.message):text;
          if(usableReply(cleaned,body.message))reply=cleaned.trim();
        } catch {modelAvailable=false;}
      }
      if(body.message)s.history.push({role:'assistant',content:reply});
      s.updated=Date.now();s.revision++;s.lastSummary=summary;s.offeredProviders=availableProviders.map(p=>p.id);s.busy=false;this.sessions.set(id,s);
      return {sessionId:id,revision:s.revision,reply,modelAvailable,stage,providers:availableProviders,slots:offeredSlots,summary,
        state:{category:s.category,date:s.date,providerId:s.providerId,startTime:s.slot?.startTime,endTime:s.slot?.endTime,timePreference:s.timePreference,issue:s.issue},
        understandingStatus:!extractionAvailable?'unavailable':clarification?'clarification':'applied',
        simulated:process.env.AGENT_SIMULATE_BOOKINGS==='true',writesEnabled:process.env.AGENT_SIMULATE_BOOKINGS==='true'||process.env.AGENT_ALLOW_BOOKINGS==='true'};
    } finally {stored.busy=false;}
  }
}
