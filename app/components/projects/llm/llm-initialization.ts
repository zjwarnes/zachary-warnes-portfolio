'use client'

import { InitProgressCallback, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import * as webllm from '@mlc-ai/web-llm';

const appConfig = webllm.prebuiltAppConfig;
appConfig.useIndexedDBCache = true;

class ModelManager {
  private static instance: ModelManager;
  private engine: webllm.MLCEngineInterface | null = null;
  private initializationPromise: Promise<void> | null = null;

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
          "Phi-3.5-mini-instruct-q4f16_1-MLC-1k",
          {
            initProgressCallback: progressCallback,
            appConfig: appConfig
          }
        );

        console.log('Model initialized successfully');
        resolve();
      } catch (error) {
        console.error('Initialization error:', error);
        this.initializationPromise = null;
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.engine) {
      throw new Error('Model not initialized');
    }

    try {
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      const chunks = await this.engine.chat.completions.create({
        messages,
        temperature: 0.5,
        stream: true,
        max_tokens: 1024
      });

      let response = '';
      for await (const chunk of chunks) {
        response += chunk.choices[0]?.delta.content || '';
      }

      return response;
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