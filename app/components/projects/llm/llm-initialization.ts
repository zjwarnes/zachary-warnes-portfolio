'use client'

import { InitProgressCallback, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import * as webllm from '@mlc-ai/web-llm';
import { embeddingManager } from './rag/embedding-manager';
import { resumeChunks } from './resume-data';

const appConfig = webllm.prebuiltAppConfig;
appConfig.useIndexedDBCache = true;

interface RetrievedContext {
  chunks: Array<{ text: string; id: string }>;
  context: string;
}

class ModelManager {
  private static instance: ModelManager;
  private engine: webllm.MLCEngineInterface | null = null;
  private initializationPromise: Promise<void> | null = null;
  private resumeContextReady = false;

  private constructor() { }

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async initialize(progressCallback?: InitProgressCallback): Promise<void> {
    if (this.engine) return;

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Starting model initialization...');

        this.engine = await webllm.CreateWebWorkerMLCEngine(
          new Worker(
            new URL('./worker.ts', import.meta.url),
            { type: 'module' }
          ),
          "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
          {
            initProgressCallback: progressCallback,
            appConfig: appConfig
          }
        );

        console.log('Model initialized successfully');

        // Initialize resume context
        await this.initializeResumeContext();

        resolve();
      } catch (error) {
        console.error('Initialization error:', error);
        this.initializationPromise = null;
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  private async initializeResumeContext(): Promise<void> {
    try {
      console.log('Initializing resume context...');

      // Initialize embedding manager
      await embeddingManager.initialize();

      // Convert resume chunks to embedding format
      const textChunks = resumeChunks.map((chunk, idx) => ({
        id: chunk.id,
        text: chunk.text,
        pageNumber: 1,
        startIndex: idx
      }));

      // Embed all resume chunks
      await embeddingManager.embedChunks(textChunks);
      console.log(`Embedded ${resumeChunks.length} resume chunks`);
      this.resumeContextReady = true;
    } catch (error) {
      console.error('Failed to initialize resume context:', error);
      // Don't fail initialization, just log the error
    }
  }

  private async retrieveRelevantContext(userPrompt: string): Promise<RetrievedContext> {
    try {
      if (!this.resumeContextReady) {
        return { chunks: [], context: '' };
      }

      const relevantChunks = await embeddingManager.retrieveRelevantChunks(userPrompt);

      if (relevantChunks.length === 0) {
        return { chunks: [], context: '' };
      }

      const context = relevantChunks.map(chunk => chunk.text).join('\n\n');
      return {
        chunks: relevantChunks.map(chunk => ({
          text: chunk.text,
          id: chunk.id
        })),
        context
      };
    } catch (error) {
      console.error('Error retrieving context:', error);
      return { chunks: [], context: '' };
    }
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<{ response: string; sources: Array<{ text: string; id: string }> }> {
    if (!this.engine) {
      throw new Error('Model not initialized');
    }

    try {
      // Retrieve relevant resume context
      const { context, chunks } = await this.retrieveRelevantContext(userPrompt);

      // Enhance system prompt with resume context if available
      let enhancedSystemPrompt = systemPrompt;
      if (context) {
        enhancedSystemPrompt = `${systemPrompt}\n\nYou have access to the following resume information:\n\n${context}\n\nUse this information to provide relevant and personalized responses.`;
      }

      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: enhancedSystemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const streamedChunks = await this.engine.chat.completions.create({
        messages,
        temperature: 0.5,
        stream: true,
        max_tokens: 256
      });

      let response = '';
      for await (const chunk of streamedChunks) {
        response += chunk.choices[0]?.delta.content || '';
      }

      return { response, sources: chunks };
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  async cleanup() {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
    }
    this.initializationPromise = null;
  }

  async interruptGeneration() {
    if (this.engine) {
      this.engine.interruptGenerate();
    }
  }
}

export const modelManager = ModelManager.getInstance();