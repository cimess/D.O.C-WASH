import React, { useState, useRef, useEffect } from 'react';
import { createChatSession, searchCleaningTips } from '../services/geminiService';
import { ChatMessage, GroundingChunk } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm the D.O.C Wash AI assistant. Ask me about our services or general cleaning tips!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!chatRef.current && !isOpen) {
      chatRef.current = createChatSession();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    setGroundingChunks([]);

    try {
      // Logic: If user asks for tips/info, maybe use search.
      // For simplicity, we check keywords or just use the chat model's knowledge
      // unless user explicitly asks for "search" or "find info".
      // But user requirement says: "Use Google Search data... where relevant"
      // We will try to detect if it's an informational query vs a service query.

      const isInfoQuery = /tips|how to|standards|news|guide/i.test(userMsg);

      let replyText = "";

      if (isInfoQuery) {
          // Use search grounding
          const result = await searchCleaningTips(userMsg);
          replyText = result.text || "I found some information.";
          if (result.chunks) setGroundingChunks(result.chunks);
      } else {
          // Use standard Chat
          const result = await chatRef.current.sendMessage({ message: userMsg });
          replyText = result.text;
      }

      setMessages(prev => [...prev, { role: 'model', text: replyText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again.", isError: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all transform hover:scale-110">
        {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <h3 className="font-bold">D.O.C Wash & Clean Assistant</h3>
            <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">Gemini 3 Pro</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}

            {/* Grounding Sources */}
            {groundingChunks.length > 0 && (
                <div className="mt-2 p-2 bg-slate-100 rounded text-xs text-slate-500">
                    <p className="font-semibold mb-1">Sources:</p>
                    {groundingChunks.map((chunk, i) => (
                        chunk.web ? (
                            <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="block truncate text-blue-500 hover:underline mb-1">
                                {chunk.web.title}
                            </a>
                        ) : null
                    ))}
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-700 disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
