// Standalone fixture HTTP server/checks; never initializes Prisma or real booking services.
import 'reflect-metadata';
import { Module, Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { strict as assert } from 'assert';
import { randomUUID } from 'crypto';
import { AgentController } from '../src/agent/agent.module';
import { AgentService, dateFromText } from '../src/agent/agent.service';
import { usableReply, cleanGreeting, isGreeting } from '../src/agent/agent-prompt';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { PrismaService } from '../src/prisma/prisma.service';
import { ProvidersService } from '../src/providers/providers.service';
import { BookingsService } from '../src/bookings/bookings.service';
import { cases } from './fixtures/understanding-cases';

process.env.JWT_SECRET=randomUUID();
process.env.AGENT_ALLOW_BOOKINGS='true';
process.env.AGENT_SIMULATE_BOOKINGS='false';
if(process.argv.includes('--serve'))process.env.FIXTURE_SERVE='1';
if(process.argv.includes('--live'))process.env.LIVE_OLLAMA='1';
const jwt=new JwtService({secret:process.env.JWT_SECRET});
const customer={id:'fixture-customer',role:'CUSTOMER',fullName:'Integration Test Customer',customerProfile:{address:'Fixture Flat 12',sector:'G-10',city:'Islamabad'}};
const provider={id:'fixture-provider',fullName:'Fixture Plumber',providerProfile:{trade:'Plumber',isVerified:true,hourlyRate:800,sectorsCovered:'G-10'}};
let creates=0,slotAvailable=true;
const slot={startTime:'18:00',endTime:'19:00',isAvailable:true,isLocked:false};
@Controller('auth') class FixtureLogin {
  @Post('login') login(@Body() body:any){if(body.email!=='zain@ustadji.pk')throw new Error('Fixture login only');return {user:customer,accessToken:jwt.sign({sub:customer.id})};}
}
@Module({imports:[PassportModule],controllers:[AgentController,FixtureLogin],providers:[AgentService,JwtStrategy,
  {provide:PrismaService,useValue:{user:{findUnique:async({where}:any)=>where.id==='fixture-provider'?{id:where.id,role:'PROVIDER'}:{...customer,id:where.id}}}},
  {provide:ProvidersService,useValue:{findAll:async()=>[provider]}},
  {provide:BookingsService,useValue:{getAvailableSlots:async()=>slotAvailable?[slot]:[],createBooking:async(data:any)=>{creates++;return {...data,id:'fixture-booking',bookingCode:'TEST-001',status:'PENDING_ACCEPTANCE'};}}}
]}) class FixtureModule {}
async function main(){
  const app=await NestFactory.create(FixtureModule,{logger:false});app.enableCors();app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true}));
  await app.listen(process.env.FIXTURE_SERVE?'4001':0,'127.0.0.1');
  if(process.env.FIXTURE_SERVE){console.log('Fixture backend at 127.0.0.1:4001; no real database.');return;}
  const originalFetch=globalThis.fetch;
  let modelCalls=0;
  globalThis.fetch=async(input:any,init?:any)=>{
    if(String(input).includes(':11434/')){
      modelCalls++;const request=JSON.parse(init.body);
      const text=request.messages[request.messages.length-1].content;
      return new Response(JSON.stringify({message:{content:request.format?JSON.stringify(cases[text]):'Aap kis din visit chahte hain?'}}),{status:200});
    }
    return originalFetch(input,init);
  };
  const base=await app.getUrl();
  async function post(body:any,owner='fixture-customer',authorized=true){
    const res=await fetch(base+'/agent/chat',{method:'POST',headers:{'Content-Type':'application/json',...(authorized?{Authorization:'Bearer '+jwt.sign({sub:owner})}:{})},body:JSON.stringify(body)});
    return {status:res.status,data:await res.json() as any};
  }
  try {
    assert.equal((await post({},'',false)).status,401);
    assert.equal((await post({},'fixture-provider')).status,403);
    // Exercise the real booking service's lock failure and under-lock race paths.
    let released=0;
    const lockMock:any={acquireSlotLock:async()=>({success:false,lockKey:'fixture-lock'}),releaseSlotLock:async()=>{released++;}};
    const service=new BookingsService({booking:{findFirst:async()=>null}} as any,lockMock,{} as any,{} as any);
    service.getAvailableSlots=async()=>[slot];
    const dto={customerId:customer.id,providerId:provider.id,serviceCategory:'Plumbing',issueDescription:'Fixture leak',appointmentDate:'2027-01-01',startTime:slot.startTime,endTime:slot.endTime};
    await assert.rejects(()=>service.createBooking(dto),/being booked/);assert.equal(released,0);
    lockMock.acquireSlotLock=async()=>({success:true,lockKey:'fixture-lock'});
    let lookups=0;
    const raced=new BookingsService({booking:{findFirst:async()=>++lookups===1?null:{id:'raced'}}} as any,lockMock,{} as any,{} as any);
    raced.getAvailableSlots=async()=>[slot];
    await assert.rejects(()=>raced.createBooking(dto),/just booked/);assert.equal(released,1);
    assert.equal(dateFromText('kal nahi parson','2026-11-17'),'2026-11-19');
    assert.throws(()=>dateFromText('2026-02-30','2026-01-01'));
    assert.equal(usableReply('Theek hai! Main samajh gaya: Kitchen ka pipe leak hai.', 'Kitchen ka pipe leak hai.'),false);
    assert.equal(usableReply('Visit kis din rakhni hai?', 'Kitchen ka pipe leak hai.'),true);
    assert.equal(usableReply('Your booking is confirmed', 'kal chahiye'),false);
    assert.equal(isGreeting('asalam alaym'),true);
    assert.equal(cleanGreeting('Walaykum assalam! Visit kis din rakhni hai?', 'pipe leak hai'), 'Visit kis din rakhni hai?');
    assert.equal(cleanGreeting('Wa alaikum assalam! Kya masla hai?', 'assalam alaikum'), 'Wa alaikum assalam! Kya masla hai?');
    assert.equal(cleanGreeting('Wa alaikum assalam!', 'kal visit chahiye'), '');
    const first=await post({message:'Kitchen pipe leak hai. Kal shaam plumber chahiye.'});assert.equal(first.status,201);assert.equal(first.data.providers[0].id,provider.id);assert.equal(modelCalls,1);
    const sessionId=first.data.sessionId;
    assert.equal((await post({sessionId},'other-customer')).status,400);
    assert.equal((await post({sessionId,providerId:'invented'})).status,400);
    let selected=await post({sessionId,revision:first.data.revision,providerId:provider.id});assert.equal(selected.status,201);
    const availableRevision=selected.data.revision;
    selected=await post({sessionId,revision:availableRevision,...slot});assert.equal(selected.status,201);assert.ok(selected.data.summary.includes('Fixture Flat 12'));
    process.env.AGENT_ALLOW_BOOKINGS='false';assert.equal((await post({sessionId,revision:selected.data.revision,confirm:true})).status,403);assert.equal(creates,0);process.env.AGENT_ALLOW_BOOKINGS='true';
    assert.equal((await post({sessionId,revision:availableRevision,confirm:true})).status,409);
    assert.equal((await post({sessionId,revision:selected.data.revision,confirm:true,message:'change'})).status,400);
    slotAvailable=false;assert.equal((await post({sessionId,revision:selected.data.revision,confirm:true})).status,409);assert.equal(creates,0);slotAvailable=true;
    const confirmed=await post({sessionId,revision:selected.data.revision,confirm:true});assert.equal(confirmed.status,201);assert.equal(confirmed.data.booking.status,'PENDING_ACCEPTANCE');assert.equal(creates,1);
    await post({sessionId,revision:selected.data.revision,confirm:true});assert.equal(creates,1);
    // Simulation completes through the same safeguards, with no database write.
    process.env.AGENT_ALLOW_BOOKINGS='false';process.env.AGENT_SIMULATE_BOOKINGS='true';
    const simFirst=await post({message:'Pipe leak hai, kal visit chahiye.'});
    assert.equal(simFirst.data.writesEnabled,true);assert.equal(simFirst.data.simulated,true);
    const simId=simFirst.data.sessionId;
    let sim=await post({sessionId:simId,revision:simFirst.data.revision,providerId:provider.id});
    sim=await post({sessionId:simId,revision:sim.data.revision,...slot});
    const simRevision=sim.data.revision;
    const simulated=await post({sessionId:simId,revision:simRevision,confirm:true});
    assert.equal(simulated.status,201);assert.equal(simulated.data.booking.status,'SIMULATED');assert.match(simulated.data.booking.bookingCode,/^SIM-/);assert.equal(creates,1);
    const replay=await post({sessionId:simId,revision:simulated.data.revision,confirm:true});
    assert.equal(replay.data.booking.bookingCode,simulated.data.booking.bookingCode);assert.equal(creates,1);
    process.env.AGENT_SIMULATE_BOOKINGS='false';process.env.AGENT_ALLOW_BOOKINGS='true';
    // Text choices and corrections through the real authenticated HTTP endpoint.
    let correction=await post({message:'Kitchen ka pipe leak hai.'});
    const correctionId=correction.data.sessionId;
    correction=await post({sessionId:correctionId,revision:correction.data.revision,message:'Fixture Plumber ko kal shaam 6 baje bula dein.'});
    assert.equal(correction.data.stage,'REVIEW');assert.equal(correction.data.state.startTime,'18:00');
    const stale=correction.data.revision;
    correction=await post({sessionId:correctionId,revision:stale,message:'Kal nahi parson.'});
    assert.equal(correction.data.stage,'REVIEW');assert.equal(correction.data.state.providerId,provider.id);
    const correctedSummary=correction.data.summary;
    correction=await post({sessionId:correctionId,revision:correction.data.revision,message:'Shukriya.'});
    assert.equal(correction.data.summary,correctedSummary);
    assert.equal((await post({sessionId:correctionId,revision:stale,confirm:true})).status,409);
    const afterCorrection=await post({sessionId:correctionId,revision:correction.data.revision,confirm:true});
    assert.equal(afterCorrection.status,201);assert.equal(creates,2);
    console.log('PASS: authenticated HTTP text provider/time selection, date correction, gratitude preservation and fresh confirmation.');
    console.log('PASS: greeting cleanup and simulated booking confirmation/replay without database writes.');
    console.log('PASS: authenticated HTTP flow, ownership, provider grounding, exact slot, stale confirmation, slot race, address snapshot, pending status, duplicate prevention.');
    if(process.env.LIVE_OLLAMA){
      globalThis.fetch=originalFetch;
      let live:any;
      for(const message of ['Salam, aap kya madad kar sakte hain?','Kitchen ka pipe leak hai.','Kal visit chahiye.']) {
        live=await post({sessionId:live?.data.sessionId,revision:live?.data.revision,message});
        assert.equal(live.status,201);assert.equal(live.data.modelAvailable,true);
        console.log('Live Ollama integration:',JSON.stringify({message,reply:live.data.reply,state:live.data.state}));
      }
      assert.equal(live.data.state.category,'Plumbing');assert.ok(live.data.state.date);
    }
  }finally{globalThis.fetch=originalFetch;await app.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
