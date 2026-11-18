import 'reflect-metadata';
import { strict as assert } from 'assert';
import { AgentService } from '../src/agent/agent.service';
import { resolveDate } from '../src/agent/booking-understanding';

// Real local Qwen; all profile/provider/booking data is synthetic. No mutations.
async function main() {
  const service=new AgentService({user:{findUnique:async()=>({role:'CUSTOMER',customerProfile:{sector:'F-7/2',address:'Fixture address',city:'Islamabad'}})}} as any,
    {findAll:async()=>[{id:'fixture-tariq',fullName:'Ustad Tariq Mehmood',providerProfile:{trade:'Plumber',isVerified:true,sectorsCovered:'F-7',hourlyRate:800}}]} as any,
    {getAvailableSlots:async()=>['10:00','11:00'].map(startTime=>({startTime,endTime:String(Number(startTime.slice(0,2))+1)+':00',isAvailable:true,isLocked:false})),createBooking:async()=>{throw new Error('Live understanding test must not submit bookings');}} as any);
  let r:any;
  const messages=['Kitchen ka pipe leak hai.','Tariq ko parson subah 10 baje bula dein.','10 ke bajaye 11 baje.','Parson nahi kal.'];
  for(const message of messages) {
    const started=Date.now();
    r=await service.act('fixture-customer',{sessionId:r?.sessionId,revision:r?.revision,message});
    console.log(JSON.stringify({message,seconds:Math.round((Date.now()-started)/100)/10,stage:r.stage,modelAvailable:r.modelAvailable,reply:r.reply,state:r.state}));
    assert.equal(r.modelAvailable,true,'Structured output was not usable');
    assert.equal(r.state.category,'Plumbing');
    if(message===messages[1]){assert.equal(r.stage,'REVIEW');assert.equal(r.state.providerId,'fixture-tariq');assert.equal(r.state.startTime,'10:00');assert.equal(r.state.date,resolveDate('parson').value);}
    if(message===messages[2]){assert.equal(r.stage,'REVIEW');assert.equal(r.state.startTime,'11:00');}
    if(message===messages[3]){assert.equal(r.stage,'REVIEW');assert.equal(r.state.startTime,'11:00');assert.equal(r.state.date,resolveDate('kal').value);}
  }
  console.log('PASS: real Qwen Roman Urdu extraction, provider/time grounding and multi-turn corrections; no bookings created.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
