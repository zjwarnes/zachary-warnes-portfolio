'use client'

import { useEffect, useState } from 'react';
import type { InitProgressReport, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { ChatWindow } from './chat-window';
import { DemoControls } from './demo-controls';
import { modelManager } from './llm-initialization';
import { useModelCleanup } from './model-cleanup';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ text: string; id: string }>;
}

export function LLMDemo() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an AI assistant that answers questions about Zachary Warnes' professional background and skills. Be friendly and professional, and reference specific projects or experiences from the resume when relevant."
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<string>('');

  useModelCleanup();

  const initModel = async () => {
    setIsModelLoading(true);
    try {
      const progressCallback = (report: InitProgressReport) => {
        console.log(report);
        setLoadingProgress(report.text);
      };

      await modelManager.initialize(progressCallback);
      setIsInitialized(true);
      setMessages([{
        role: 'assistant',
        content: "What would you like to know?"
      }]);
    } catch (error) {
      console.error('Failed to initialize model:', error);
      setMessages([{
        role: 'assistant',
        content: "I apologize, but I encountered an error initializing. Please try again."
      }]);
    } finally {
      setIsModelLoading(false);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (isGenerating) return;

    console.log('Sending message:', userMessage);

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    setIsGenerating(true);
    try {
      console.log('Generating response...');
      const result = await modelManager.generateResponse(systemPrompt, userMessage);
      console.log('Response generated:', result);
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: result.response,
        sources: result.sources
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

  if (!isInitialized && !isModelLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-6">
        <div className="text-center max-w-md">
          <p className="mb-4">This demo uses TinyLlama, a lightweight language model (~50MB), running entirely in your browser.</p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm space-y-2 text-left mb-4">
            <p><strong>Note:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Model, inference, and document retrieval all run locally in your browser</li>
              <li>Responses typically generate in 2-5 seconds</li>
              <li>The model has access to Zac's resume for context</li>
            </ul>
          </div>
        </div>
        <button
          onClick={initModel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download and Initialize Model
        </button>
      </div>
    );
  }

  if (isModelLoading) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <p>Loading language model... This may take a moment.</p>
        {loadingProgress && <p className="mt-2 text-sm">{loadingProgress}</p>}
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