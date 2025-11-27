'use client'

import * as React from 'react';

interface TextChunk {
  id: string;
  text: string;
  pageNumber?: number;
}

interface ChatWindowProps {
  messages: Array<{ role: 'user' | 'assistant', content: string, sources?: Array<{ text: string; id: string }> }>;
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
}

export function ChatWindow({ messages, onSendMessage, isGenerating }: ChatWindowProps) {
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isGenerating) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-background-card)] rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="space-y-2">
            <div
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
                  }`}
              >
                {message.content}
              </div>
            </div>
            {message.sources && message.sources.length > 0 && (
              <div className="flex justify-start">
                <details className="max-w-[80%] text-xs bg-gray-800 text-gray-300 rounded-lg p-2 cursor-pointer">
                  <summary className="hover:text-gray-100">📎 {message.sources.length} source(s)</summary>
                  <div className="mt-2 space-y-2 text-xs">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="border-l-2 border-blue-500 pl-2">
                        <p className="text-gray-400 line-clamp-3">{source.text.substring(0, 150)}...</p>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-white rounded-lg p-3">
              Generating response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isGenerating ? "Please wait..." : "Ask about my skills..."}
            disabled={isGenerating}
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}