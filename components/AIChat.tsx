import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Security Design Assistant online. Awaiting input.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(chatSessionRef.current, userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 backdrop-blur-2xl bg-[#0f0505]/80 border-l border-red-500/10 flex flex-col shadow-2xl z-40 transform transition-transform duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-red-500/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
        <h2 className="text-red-100 font-semibold flex items-center gap-2 text-sm tracking-wide">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 animate-pulse"></div>
          AI Assistant
        </h2>
        <button onClick={onClose} className="text-white/50 hover:text-red-400 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed border backdrop-blur-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-red-600/20 text-red-50 border-red-500/20 rounded-tr-sm' 
                  : 'bg-white/5 text-gray-300 border-white/5 rounded-tl-sm'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className="mb-1 last:mb-0">{line}</p>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm p-4 flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-red-500/10 bg-black/20">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 text-red-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/10 focus:border-red-500/20 placeholder-white/20 transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/10 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
