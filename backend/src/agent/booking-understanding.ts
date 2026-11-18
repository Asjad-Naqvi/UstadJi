import { normalize } from './understanding';

type Resolved<T> = { value?: T; clarification?: string; mentioned: boolean };
export function localDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Karachi',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
function addDays(today: string, offset: number) {
  const d = new Date(today + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0,10);
}
// The final replacement clause wins; alternatives without a correction need clarification.
function replacement(text: string) {
  const parts = text.split(/\b(?:ke\s+bajay[ea]?|ki\s+jagah|instead(?:\s+of)?|nahin|nahi|nai)\b/i);
  return parts.length > 1 ? {text:parts[parts.length-1].trim(), corrected:true} : {text, corrected:false};
}
export function resolveDate(text: string, today = localDate()): Resolved<string> {
  const changed = replacement(text);
  const expression = changed.text;
  const matches = [...expression.matchAll(/\b(20\d{2}-\d{2}-\d{2}|day after tomorrow|tomorrow|today|parso[n]?|kal|aaj|monday|tuesday|wednesday|thursday|friday|saturday|sunday|peer|mangal|budh|jumerat|jumeraat|jumma|juma|hafta|itwar)\b/gi)];
  if (!matches.length) {
    const mentioned = /\b(kal|parso[n]?|aaj|20\d{2}-|week|tareekh|tarikh|date|monday|friday)\b|\b(?:din|haft[ea])\s+baad\b/i.test(text);
    return {mentioned, ...(mentioned ? {clarification:'Visit ki exact date YYYY-MM-DD mein bata dein.'} : {})};
  }
  if (matches.length !== 1) return {mentioned:true, clarification:'Visit kis ek din chahiye? Exact date bata dein.'};
  const token = matches[0][0].toLowerCase();
  if (/^20/.test(token)) {
    const parsed = new Date(token + 'T00:00:00Z');
    if (!Number.isFinite(+parsed) || parsed.toISOString().slice(0,10) !== token || token < today) return {mentioned:true, clarification:'Aane wali valid date YYYY-MM-DD mein dein.'};
    return {mentioned:true, value:token};
  }
  const offsets: Record<string,number> = {kal:1,tomorrow:1,parson:2,parso:2,'day after tomorrow':2,aaj:0,today:0};
  if (token in offsets) return {mentioned:true, value:addDays(today,offsets[token])};
  const days: Record<string,number> = {sunday:0,itwar:0,monday:1,peer:1,tuesday:2,mangal:2,wednesday:3,budh:3,thursday:4,jumerat:4,jumeraat:4,friday:5,jumma:5,juma:5,saturday:6,hafta:6};
  let offset = (days[token] - new Date(today + 'T00:00:00Z').getUTCDay() + 7) % 7;
  if (offset === 0 && /\b(next|agle|aglay|agli)\b/i.test(expression)) offset = 7;
  return {mentioned:true, value:addDays(today,offset)};
}

export type TimePreference = {kind:'exact';startTime:string} | {kind:'period';from:string;to:string};
export function resolveTime(text: string, previous?: TimePreference): Resolved<TimePreference> {
  const changed = replacement(text);
  let expression = changed.text.toLowerCase();
  const words: Record<string,string> = {aik:'1',ek:'1',do:'2',teen:'3',char:'4',chaar:'4',paanch:'5',panch:'5',chay:'6',saat:'7',aath:'8',nau:'9',das:'10',gyarah:'11',barah:'12'};
  const numberWords='aik|ek|do|teen|char|chaar|paanch|panch|chay|saat|aath|nau|das|gyarah|barah';
  // "kar do" is a verb, not 2 o'clock. Convert number words only in a time phrase.
  expression=expression.replace(new RegExp('\\b('+numberWords+')(?=\\s*(?:baj[ey]|am|pm)\\b)','g'),v=>words[v]);
  expression=expression.replace(new RegExp('\\b(subah|shaam|sham|raat|dopahar)\\s+('+numberWords+')\\b','g'),(_,period,word)=>period+' '+words[word]);
  if(expression in words)expression=words[expression];
  const morning = /\b(sub[ah]+|morning|am)\b/i.test(expression);
  const evening = /\b(shaam|sham|evening|dopahar|dupehar|afternoon|pm)\b/i.test(expression);
  const night = /\b(raat|night)\b/i.test(expression);
  const times = [...expression.matchAll(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/gi)];
  if ((morning && (evening || night)) || (night && evening)) return {mentioned:true, clarification:'Subah ya shaam? Ek waqt bata dein.'};
  if (!times.length) {
    if (morning) return {mentioned:true,value:{kind:'period',from:'06:00',to:'12:00'}};
    if (evening) return {mentioned:true,value:{kind:'period',from:/\b(shaam|sham|evening)\b/.test(expression)?'16:00':'12:00',to:/\b(shaam|sham|evening)\b/.test(expression)?'21:00':'17:00'}};
    if (night) return {mentioned:true,clarification:'Raat ka exact waqt HH:mm mein bata dein, jaise 22:00.'};
    return {mentioned:true,clarification:'Waqt subah/shaam ke saath ya HH:mm mein bata dein.'};
  }
  if (times.length !== 1 || /\b(sa[ar]he|saarhe|sawa|paune|half|quarter)\b/i.test(expression)) return {mentioned:true,clarification:'Exact waqt HH:mm mein bata dein, jaise 10:30.'};
  const [_, hourText, minuteText, suffix] = times[0];
  let hour = Number(hourText), minute = Number(minuteText || 0);
  if (hour > 23 || minute > 59) return {mentioned:true,clarification:'Valid waqt HH:mm mein bata dein.'};
  if ((morning || evening || night || suffix) && (hour < 1 || hour > 12)) {
    // Explicit 24h HH:mm is accepted only without a conflicting AM/PM period.
    return {mentioned:true,clarification:'Waqt 24-hour format mein dein, jaise 18:00.'};
  }
  if(morning&&hour===12&&!suffix)return {mentioned:true,clarification:'12 baje dopahar ya raat? 12:00 ya 00:00 likhein.'};
  if (evening || suffix?.toLowerCase() === 'pm') hour = hour % 12 + 12;
  else if (morning || suffix?.toLowerCase() === 'am') hour %= 12;
  else if (night) hour = hour === 12 ? 0 : hour <= 5 ? hour : hour + 12;
  else if (!minuteText && hour <= 12) {
    if (changed.corrected && previous?.kind === 'exact') {
      const previousHour = Number(previous.startTime.slice(0,2));
      hour = hour % 12 + (previousHour >= 12 ? 12 : 0);
    } else return {mentioned:true,clarification:`${hour} baje subah ya shaam?`};
  }
  return {mentioned:true,value:{kind:'exact',startTime:`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`}};
}

export function resolveProvider(reference: string, candidates: {id:string;name:string}[], previouslyOffered: string[] = []): Resolved<string> {
  const text = normalize(reference);
  const ordinals: Record<string,number> = {pehla:0,pehle:0,first:0,doosra:1,dusra:1,second:1,teesra:2,third:2};
  const ordinal = text.split(' ').find(v=>v in ordinals);
  if (ordinal) {
    const id = previouslyOffered[ordinals[ordinal]];
    return id && candidates.some(p=>p.id===id) ? {mentioned:true,value:id} : {mentioned:true,clarification:'Neeche card se ustad select karein; ye choice list mein nahi hai.'};
  }
  const tokens = text.split(' ').filter(v=>!['ustad','ustaad','bhai','sahab','ko','wala','walay'].includes(v));
  const matches = tokens.length ? candidates.filter(p=>tokens.every(t=>normalize(p.name).split(' ').includes(t))) : [];
  return matches.length === 1 ? {mentioned:true,value:matches[0].id} : {mentioned:true,clarification:matches.length ? 'Is naam ke ek se zyada ustad hain. Neeche card se select karein.' : 'Is naam ka matching verified ustad nahi mila. Neeche card se select karein.'};
}

export function matchesTime(startTime: string, preference?: TimePreference) {
  return !preference || (preference.kind === 'exact' ? startTime === preference.startTime : startTime >= preference.from && startTime < preference.to);
}
