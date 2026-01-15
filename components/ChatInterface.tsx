
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithDocument } from '../services/geminiService';

interface ChatInterfaceProps {
  docText: string;
  history: ChatMessage[];
  onNewMessage: (msg: ChatMessage) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ docText, history, onNewMessage }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };
    onNewMessage(userMsg);
    setInput('');
    setIsLoading(true);

    try {
      const geminiHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));

      const response = await chatWithDocument(docText, input, geminiHistory);
      
      const botMsg: ChatMessage = {
        role: 'model',
        text: response || "I'm sorry, I couldn't process that request.",
        timestamp: Date.now()
      };
      onNewMessage(botMsg);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
      >
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-sm flex items-center justify-center text-indigo-500">
              <i className="fas fa-comments text-2xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold">Start a Conversation</h3>
              <p className="text-sm text-slate-500">Ask anything about the document. I can find specific details, explain complex parts, or rewrite sections.</p>
            </div>
          </div>
        )}
        
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800'
              }`}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
