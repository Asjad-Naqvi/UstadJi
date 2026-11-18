import 'reflect-metadata';
import { strict as assert } from 'assert';
import { AgentService } from '../src/agent/agent.service';
import { validateUnderstanding, understandingSchema } from '../src/agent/understanding';
import { resolveDate, resolveTime, resolveProvider } from '../src/agent/booking-understanding';
import { cases, proposal } from './fixtures/understanding-cases';

async function main() {
  const originalFetch=globalThis.fetch;
  const originalAllow=process.env.AGENT_ALLOW_BOOKINGS, originalSim=process.env.AGENT_SIMULATE_BOOKINGS;
  process.env.AGENT_ALLOW_BOOKINGS='true';process.env.AGENT_SIMULATE_BOOKINGS='false';
  let override:unknown, failModel=false, failMutation=false, creates=0;
  let lastWrite:any;
  let providers=[
    {id:'tariq',fullName:'Ustad Tariq Mehmood',providerProfile:{trade:'Master Plumber',sectorsCovered:'F-7',isVerified:true,hourlyRate:800}},
    {id:'ali',fullName:'Ustad Ali',providerProfile:{trade:'Plumber',sectorsCovered:'F-7',isVerified:true,hourlyRate:900}},
    {id:'unverified',fullName:'Zafar',providerProfile:{trade:'Plumber',sectorsCovered:'F-7',isVerified:false,hourlyRate:700}},
    {id:'wrong-area',fullName:'Zafar',providerProfile:{trade:'Plumber',sectorsCovered:'F-8',isVerified:true,hourlyRate:700}},
    {id:'electrician',fullName:'Ustad Bilal',providerProfile:{trade:'Electrician',sectorsCovered:'F-7',isVerified:true,hourlyRate:950}},
  ];
  let slots=['09:00','10:00','11:00','18:00'].map(startTime=>({startTime,endTime:String(Number(startTime.slice(0,2))+1).padStart(2,'0')+':00',isAvailable:true,isLocked:false}));
  const service=new AgentService({user:{findUnique:async()=>({role:'CUSTOMER',customerProfile:{sector:'F-7/2',address:'Test address',city:'Islamabad'}})}} as any,
    {findAll:async()=>providers} as any,
    {getAvailableSlots:async()=>slots,createBooking:async(data:any)=>{creates++;lastWrite=data;if(failMutation)throw new Error('Unknown outcome');return {id:'test-booking',bookingCode:'TEST-002',status:'PENDING_ACCEPTANCE'};}} as any);
  globalThis.fetch=async(_input:any,init?:any)=>{
    const request=JSON.parse(init.body);
    if(request.format) {
      assert.deepEqual(request.format.required,understandingSchema.required);assert.equal(request.format.additionalProperties,false);
      if(failModel)throw new Error('Offline');
      const message=request.messages[request.messages.length-1].content;
      const output=override===undefined?cases[message]:override;
      assert.ok(output,'Missing hand-labelled case: '+message);
      return new Response(JSON.stringify({message:{content:JSON.stringify(output)}}));
    }
    return new Response(JSON.stringify({message:{content:'Khushi se! Neeche ki details dekh lein.'}}));
  };
  try {
    const today='2026-11-17';
    assert.equal(resolveDate('kal nahi parson',today).value,'2026-11-19');
    assert.equal(resolveDate('parson nahi kal',today).value,'2026-11-18');
    assert.equal(resolveDate('jumma',today).value,'2026-11-20');
    assert.ok(resolveDate('kal ya parson',today).clarification);
    assert.ok(resolveDate('kal nahi',today).clarification);
    assert.ok(resolveDate('2030-02-30',today).clarification);
    assert.ok(resolveDate('2026-11-16',today).clarification);
    assert.deepEqual(resolveTime('subah das baje').value,{kind:'exact',startTime:'10:00'});
    assert.deepEqual(resolveTime('Tariq ko kal subah das baje bula do').value,{kind:'exact',startTime:'10:00'});
    assert.deepEqual(resolveTime('shaam 7 baje').value,{kind:'exact',startTime:'19:00'});
    assert.deepEqual(resolveTime('raat 2 baje').value,{kind:'exact',startTime:'02:00'});
    assert.ok(resolveTime('subah 12 baje').clarification);
    assert.ok(resolveTime('raat 12 pm').clarification);
    assert.deepEqual(resolveTime('10 ke bajaye 11 baje',{kind:'exact',startTime:'10:00'}).value,{kind:'exact',startTime:'11:00'});
    assert.deepEqual(resolveTime('shaam 10 nahi subah 11 baje').value,{kind:'exact',startTime:'11:00'});
    assert.ok(resolveTime('10 baje').clarification);
    assert.ok(resolveTime('25:00').clarification);
    assert.ok(resolveTime('10 ya 11 baje').clarification);
    assert.ok(resolveTime('saarhe das baje').clarification);
    assert.throws(()=>validateUnderstanding({...proposal(),providerId:'invented'},'hello'));
    assert.throws(()=>validateUnderstanding(proposal({dateText:'parson'}),'kal chahiye'));
    assert.throws(()=>validateUnderstanding(proposal({dateText:'kal'}),'akal'));
    assert.throws(()=>validateUnderstanding(proposal({intent:'other',timeText:'10 baje'}),'10 baje'));
    assert.equal(validateUnderstanding(proposal({dateText:'kal',timeText:'null'}),'Parson nahi kal.').timeText,null);
    assert.throws(()=>validateUnderstanding(proposal({category:'Plumbing'}),'pipe'));
    assert.throws(()=>validateUnderstanding(proposal({category:'Invented' as any,serviceText:'pipe'}),'pipe'));
    assert.ok(resolveProvider('Tariq',[{id:'1',name:'Tariq Mehmood'},{id:'2',name:'Tariq Ali'}]).clarification);
    assert.ok(resolveProvider('second',[{id:'1',name:'Tariq'}],[]).clarification);

    let r:any=await service.act('customer',{message:'Kitchen ka pipe leak hai.'});
    const id=r.sessionId;
    const message=async(text:string)=>{r=await service.act('customer',{sessionId:id,revision:r.revision,message:text});return r;};
    await message('Tariq ko kal subah 10 baje bula dein.');
    assert.equal(r.stage,'REVIEW');assert.equal(r.state.providerId,'tariq');assert.equal(r.state.startTime,'10:00');assert.ok(r.summary);
    const summary=r.summary,oldRevision=r.revision;
    await message('Shukriya.');assert.equal(r.summary,summary);assert.equal(r.state.startTime,'10:00');
    await message('Kal nahi parson.');assert.equal(r.state.providerId,'tariq');assert.equal(r.state.date,resolveDate('parson').value);assert.ok(r.summary);
    override=proposal({intent:'correct',dateText:'Kal nahi parson',timeText:'Kal nahi parson'});
    await message('Kal nahi parson.');assert.equal(r.state.startTime,'10:00');assert.ok(r.summary);override=undefined;
    await assert.rejects(()=>service.act('customer',{sessionId:id,revision:oldRevision,confirm:true}),/Latest/);
    await message('10 ke bajaye 11 baje.');assert.equal(r.state.startTime,'11:00');assert.equal(r.state.date,resolveDate('parson').value);
    override=proposal({intent:'correct',dateText:'10 ke bajaye 11 baje',timeText:'10 ke bajaye 11 baje'});
    await message('10 ke bajaye 11 baje.');assert.equal(r.state.startTime,'11:00');assert.equal(r.state.date,resolveDate('parson').value);override=undefined;
    await message('Pani bohat tez beh raha hai.');assert.match(r.state.issue,/Kitchen.*Pani/);assert.equal(r.state.startTime,'11:00');
    await message('Kal se pipe leak ho raha hai.');assert.equal(r.state.date,resolveDate('parson').value);assert.equal(r.state.startTime,'11:00');
    await message('2030-02-30 ko chahiye.');assert.equal(r.summary,null);assert.equal(r.stage,'CLARIFY');assert.equal(r.state.date,undefined);
    await message('Kal ya parson.');assert.equal(r.summary,null);
    await message('Kal.');assert.equal(r.stage,'REVIEW');
    await message('10 baje.');assert.equal(r.stage,'CLARIFY');assert.equal(r.summary,null);
    await message('Subah 10 baje.');assert.equal(r.state.startTime,'10:00');assert.ok(r.summary);
    await message('Shaam 7 baje.');assert.equal(r.summary,null);assert.match(r.reply,/19:00.*available nahi/);
    await message('Subah 10 baje.');
    await message('Zafar ko bula dein.');assert.equal(r.summary,null);assert.equal(r.state.providerId,undefined);
    await assert.rejects(()=>service.act('customer',{sessionId:id,revision:r.revision,providerId:'unverified'}),/available nahi/);
    providers.push({...providers[0],id:'tariq-2',fullName:'Tariq Ali'});
    await message('Tariq ko bula dein.');assert.equal(r.stage,'CLARIFY');assert.match(r.reply,/ek se zyada/);
    r=await service.act('customer',{sessionId:id,revision:r.revision,providerId:'tariq'});assert.ok(r.summary);
    override={...proposal(),customerId:'other',confirm:true};await message('Shukriya.');assert.equal(r.modelAvailable,false);assert.equal(r.summary,null);override=undefined;
    failModel=true;await message('Subah 10 baje.');assert.equal(r.summary,null);failModel=false;
    override=proposal({intent:'other'});await message('Subah 10 baje.');assert.equal(r.summary,null);assert.equal(r.stage,'CLARIFY');override=undefined;
    await message('Subah 10 baje.');assert.ok(r.summary);
    await message('Confirm kar do.');assert.equal(creates,0);assert.equal(r.summary,null);
    await message('Subah 10 baje.');
    const beforeRace=r.revision;
    const oldSlots=slots;slots=slots.filter(v=>v.startTime!=='10:00');
    await assert.rejects(()=>service.act('customer',{sessionId:id,revision:beforeRace,confirm:true}));assert.equal(creates,0);slots=oldSlots;
    await message('Plumber nahi, electrician chahiye. Pankha band hai.');
    assert.equal(r.state.category,'Electrical');assert.equal(r.state.providerId,undefined);assert.equal(r.summary,null);assert.deepEqual(r.providers.map((p:any)=>p.id),['electrician']);
    // Full text choices -> explicit confirmation -> correct actor and resolved server IDs.
    let full:any=await service.act('customer',{message:'Kitchen ka pipe leak hai.'});
    full=await service.act('customer',{sessionId:full.sessionId,revision:full.revision,message:'Tariq ko parson subah 10 baje bula dein.'});
    // Ambiguous name cannot auto-select; use a verified card then confirm.
    full=await service.act('customer',{sessionId:full.sessionId,revision:full.revision,providerId:'tariq'});
    full=await service.act('customer',{sessionId:full.sessionId,revision:full.revision,confirm:true});
    assert.equal(creates,1);assert.equal(full.booking.status,'PENDING_ACCEPTANCE');assert.equal(lastWrite.customerId,'customer');assert.equal(lastWrite.providerId,'tariq');assert.equal(lastWrite.startTime,'10:00');
    await service.act('customer',{sessionId:full.sessionId,revision:full.revision,confirm:true});assert.equal(creates,1);
    providers=providers.filter(v=>v.id!=='tariq-2');
    let failed:any=await service.act('customer',{message:'Kitchen ka pipe leak hai.'});
    failed=await service.act('customer',{sessionId:failed.sessionId,revision:failed.revision,message:'Tariq ko parson subah 10 baje bula dein.'});
    failMutation=true;
    await assert.rejects(()=>service.act('customer',{sessionId:failed.sessionId,revision:failed.revision,confirm:true}),/Unknown/);
    await assert.rejects(()=>service.act('customer',{sessionId:failed.sessionId,revision:failed.revision,confirm:true}),/outcome verify/);
    assert.equal(creates,2);
    console.log('PASS: grounded schemas, Roman Urdu dates/times, text selections, corrections, gratitude preservation, ambiguity, malformed/offline extraction, unavailable slots, identity, explicit confirmation and unknown-outcome retry protection. No real database writes.');
  } finally {
    globalThis.fetch=originalFetch;
    if(originalAllow===undefined)delete process.env.AGENT_ALLOW_BOOKINGS;else process.env.AGENT_ALLOW_BOOKINGS=originalAllow;
    if(originalSim===undefined)delete process.env.AGENT_SIMULATE_BOOKINGS;else process.env.AGENT_SIMULATE_BOOKINGS=originalSim;
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
