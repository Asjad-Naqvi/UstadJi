import React, { createContext, useContext, useRef, useState } from 'react';
import { agentChat } from '../services/api';

type Message = {id:string;sender:'user'|'agent';text:string};
type Result = {sessionId:string;revision:number;reply:string;modelAvailable?:boolean;understandingStatus?:'applied'|'clarification'|'unavailable';providers:{id:string;name:string;trade:string;estimatedHourlyRate:number}[];slots:{startTime:string;endTime:string}[];summary:string|null;writesEnabled?:boolean;simulated?:boolean;booking?:{bookingCode:string;status:string}};

function useConversation() {
  const [messages,setMessages]=useState<Message[]>([{id:'welcome',sender:'agent',text:'Ghar mein kis cheez ka masla hai? Hum aap ke saved service address ke liye booking details tayyar karenge.'}]);
  const [inputText,setInputText]=useState('');
  const [result,setResult]=useState<Result|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const pending=useRef(false);
  const act=async (action:Parameters<typeof agentChat>[0],label?:string) => {
    if(pending.current)return;
    pending.current=true;setLoading(true);setError('');
    if(label)setMessages(prev=>[...prev,{id:Date.now()+'u',sender:'user',text:label}]);
    try {
      const next:Result=await agentChat({sessionId:result?.sessionId,revision:result?.revision,...action});
      setResult(next);setMessages(prev=>[...prev,{id:Date.now()+'a',sender:'agent',text:next.reply}]);
      if(next.modelAvailable===false)setError(next.understandingStatus==='unavailable'?'Local model se details clear nahi huin. Message dobara likhein; request submit nahi hui.':'Ollama se jawab nahi mila. Neeche backend ke verified options use kar sakte hain.');
    } catch(e) {setError(e instanceof Error?e.message:'Request failed');}
    finally {pending.current=false;setLoading(false);}
  };
  const send=()=>{const text=inputText.trim();if(!text||pending.current)return;setInputText('');setResult(prev=>prev?{...prev,summary:null}:prev);void act({message:text},text);};
  const newChat=()=>{
    if(pending.current)return;
    setMessages([{id:'welcome',sender:'agent',text:'Ghar mein kis cheez ka masla hai? Hum aap ke saved service address ke liye booking details tayyar karenge.'}]);
    setInputText('');setResult(null);setError('');
  };
  return {messages,inputText,setInputText,result,loading,error,act,send,newChat};
}
const AgentChatContext=createContext<ReturnType<typeof useConversation>|null>(null);

// Lives above navigation; key this provider by the signed-in account to isolate chats.
export function AgentChatProvider({children}:React.PropsWithChildren) {
  const conversation=useConversation();
  return <AgentChatContext.Provider value={conversation}>{children}</AgentChatContext.Provider>;
}
export function useAgentConversation() {
  const value=useContext(AgentChatContext);
  if(!value)throw new Error('Agent chat must be inside AgentChatProvider');
  return value;
}
