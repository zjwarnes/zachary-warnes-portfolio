'use client'

import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChatWindow } from './chat-window';
import { DemoControls } from './demo-controls';
import { modelManager } from './llm-initialization';
import { useModelCleanup } from './model-cleanup';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function LLMDemo() {
  const [isModelLoading, setIsModelLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [systemPrompt, setSystemPrompt] = React.useState(
    "You are an AI assistant"
  );
  const [messages, setMessages] = React.useState<Message[]>([]);

  // Use the cleanup hook
  useModelCleanup();

  React.useEffect(() => {
    const initModel = async () => {
      try {
        await modelManager.initialize();
        setIsModelLoading(false);
        setMessages([{
          role: 'assistant',
          content: "What would you like to know?"
        }]);
      } catch (error) {
        console.error('Failed to initialize model:', error);
        setIsModelLoading(false);
        setMessages([{
          role: 'assistant',
          content: "I apologize, but I encountered an error initializing. Please refresh the page to try again."
        }]);
      }
    };

    initModel();
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    if (isGenerating) return;

    console.log('Sending message:', userMessage);   

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    
    setIsGenerating(true);
    try {
      console.log('Generating response...');
      const result = await modelManager.generateResponse(systemPrompt, userMessage);
      console.log('Response generated:', result);
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant', 
        content: result
      }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error generating a response. Please try again."
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isModelLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading language model... This may take a moment.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full">
        <DemoControls
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
        />
      </div>
      
      <div className="flex-1 relative">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}