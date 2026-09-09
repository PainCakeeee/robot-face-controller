import { useState, useEffect } from 'react';

export type RobotState = 'idle' | 'scanning' | 'thinking' | 'result' | 'love' | 'surprise';
export type ResultType = 'Creative' | 'Beautiful' | 'Professional' | 'Genius';
export type ResultLanguage = 'en' | 'fi';

export interface KnowledgePoint {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export const KNOWLEDGE_POINTS: KnowledgePoint[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `Knowledge Point ${i + 1}`,
  description: `This is a fascinating insight about knowledge point ${i + 1}. It covers various aspects of technology, art, and science that are relevant to our current exploration.`,
  imageUrl: `https://picsum.photos/seed/robot-kp-${i + 1}/800/600`,
}));

export interface ControlMessage {
  type: 'SET_STATE';
  state: RobotState;
  resultType?: ResultType;
  knowledgeId?: number;
  resultLanguage?: ResultLanguage;
}

export const useRobotControl = (role: 'display' | 'controller' | 'preview') => {
  const [state, setState] = useState<RobotState>('idle');
  const [resultType, setResultType] = useState<ResultType | null>(null);
  const [knowledgeId, setKnowledgeId] = useState<number | null>(null);
  const [resultLanguage, setResultLanguage] = useState<ResultLanguage>('en');

  useEffect(() => {
    const channel = new BroadcastChannel('robot-control');

    const handleMessage = (event: MessageEvent<ControlMessage>) => {
      if (event.data.type === 'SET_STATE') {
        setState(event.data.state);
        if (event.data.resultType) setResultType(event.data.resultType);
        if (event.data.knowledgeId) setKnowledgeId(event.data.knowledgeId);
        if (event.data.resultLanguage) setResultLanguage(event.data.resultLanguage);
      }
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [role]);

  const sendMessage = (msg: ControlMessage) => {
    const channel = new BroadcastChannel('robot-control');
    channel.postMessage(msg);
    channel.close();
    
    // Update local state
    setState(msg.state);
    if (msg.resultType) setResultType(msg.resultType);
    if (msg.knowledgeId) setKnowledgeId(msg.knowledgeId);
    if (msg.resultLanguage) setResultLanguage(msg.resultLanguage);
  };

  return { state, resultType, knowledgeId, resultLanguage, sendMessage };
};
