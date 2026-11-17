import { Understanding } from '../../src/agent/understanding';
export const proposal = (fields:Partial<Understanding> = {}):Understanding => ({intent:'create',category:null,serviceText:null,issueText:null,dateText:null,timeText:null,providerText:null,unclear:false,...fields});
// Hand-labelled model responses, independent of the server's parsers and transitions.
export const cases:Record<string,Understanding> = {
  'Kitchen pipe leak hai. Kal shaam plumber chahiye.':proposal({category:'Plumbing',serviceText:'pipe leak',issueText:'Kitchen pipe leak hai.',dateText:'Kal',timeText:'shaam'}),
  'Pipe leak hai, kal visit chahiye.':proposal({category:'Plumbing',serviceText:'Pipe leak',issueText:'Pipe leak hai',dateText:'kal'}),
  'Kitchen ka pipe leak hai.':proposal({category:'Plumbing',serviceText:'pipe leak',issueText:'Kitchen ka pipe leak hai.'}),
  'Tariq ko kal subah 10 baje bula dein.':proposal({providerText:'Tariq',dateText:'kal',timeText:'subah 10 baje'}),
  'Tariq ko parson subah 10 baje bula dein.':proposal({providerText:'Tariq',dateText:'parson',timeText:'subah 10 baje'}),
  'Fixture Plumber ko kal shaam 6 baje bula dein.':proposal({providerText:'Fixture Plumber',dateText:'kal',timeText:'shaam 6 baje'}),
  'Kal nahi parson.':proposal({intent:'correct',dateText:'Kal nahi parson'}),
  '10 ke bajaye 11 baje.':proposal({intent:'correct',timeText:'10 ke bajaye 11 baje'}),
  'Pani bohat tez beh raha hai.':proposal({issueText:'Pani bohat tez beh raha hai.'}),
  'Kal se pipe leak ho raha hai.':proposal({issueText:'Kal se pipe leak ho raha hai.'}),
  'Shukriya.':proposal({intent:'other'}),
  '2030-02-30 ko chahiye.':proposal({intent:'correct',dateText:'2030-02-30'}),
  'Kal ya parson.':proposal({intent:'correct',dateText:'Kal ya parson'}),
  'Kal.':proposal({intent:'correct',dateText:'Kal'}),
  '10 baje.':proposal({intent:'correct',timeText:'10 baje'}),
  'Subah 10 baje.':proposal({intent:'correct',timeText:'Subah 10 baje'}),
  'Shaam 7 baje.':proposal({intent:'correct',timeText:'Shaam 7 baje'}),
  'Zafar ko bula dein.':proposal({intent:'correct',providerText:'Zafar'}),
  'Tariq ko bula dein.':proposal({intent:'correct',providerText:'Tariq'}),
  'Doosra ustad.':proposal({intent:'correct',providerText:'Doosra'}),
  'Plumber nahi, electrician chahiye. Pankha band hai.':proposal({intent:'correct',category:'Electrical',serviceText:'electrician',issueText:'Pankha band hai.'}),
  'Confirm kar do.':proposal(),
  'Meri booking cancel karo.':proposal({intent:'cancel'}),
  'Pipe aur AC dono theek karwa do.':proposal({unclear:true}),
};
