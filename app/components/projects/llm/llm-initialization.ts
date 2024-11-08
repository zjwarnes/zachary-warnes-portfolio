'use client'

let pipeline: any;
let env: any;

// Only import transformers on the client side
if (typeof window !== 'undefined') {
  const transformers = require('@xenova/transformers');
  pipeline = transformers.pipeline;
  env = transformers.env;
  
  // Simplified environment configuration focusing on WASM
  env.useBrowserCache = true;
  env.allowLocalModels = false;
  
  // Remove custom WASM paths - let the library handle defaults
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.proxy = false;
  
  // Enable debug logging for WASM
  env.debug = true;
}

// Rest of the configuration
interface ModelConfig {
  name: string;
  options: {
    max_new_tokens: number;
    temperature: number;
    do_sample: boolean;
    top_k: number;
    top_p: number;
    repetition_penalty: number;
    use_cache: boolean;
    quantization: string;
    chunk_size?: number;
  };
}

const MODEL_CONFIG: ModelConfig = {
  name: 'Xenova/TinyLlama-1.1B-Chat-v1.0',
  options: {
    max_new_tokens: 128,
    temperature: 0.7,
    do_sample: true,
    top_k: 50,
    top_p: 0.9,
    repetition_penalty: 1.2,
    use_cache: true,
    quantization: 'none',
    chunk_size: 256
  }
};

class ModelManager {
  private static instance: ModelManager;
  private generator: any = null;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.generator) return;
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = new Promise<void>(async (resolve, reject) => {
      try {
        if (typeof window === 'undefined') {
          throw new Error('Cannot initialize model on server side');
        }

        console.log('Starting model initialization...');
        
        // Basic pipeline initialization without custom WASM config
        const generator = await pipeline('text-generation', MODEL_CONFIG.name, {
        //   quantized: true,
          progress_callback: (progress: any) => {
            console.log('Loading model:', Math.round(progress.progress * 100), '%');
          }
        });
        
        console.log('Model pipeline created successfully');
        this.generator = generator;
        
        resolve();
      } catch (error) {
        console.error('Detailed initialization error:', error);
        if (error instanceof Error) {
          console.error('Error name:', error.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        this.initializationPromise = null;
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  async generateResponse(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.generator) {
      throw new Error('Model not initialized');
    }

    try {
      // Create the chat template first
      const prompt = this.generator.tokenizer.apply_chat_template(
        [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        {
          tokenize: false,
          add_generation_prompt: true
        }
      );

      // Check token count before generation
      const tokenCount = (await this.generator.tokenizer.encode(prompt)).length;
      const maxTokens = 1024; // Adjust based on model's context window
      
      if (tokenCount > maxTokens) {
        return "I apologize, but the input is too long. Please try a shorter message.";
      }
      
      console.log('Token count:', tokenCount);
      console.log('Generating response in model manager...');
      
      // Update the model options with appropriate max length
      const generationOptions = {
        ...MODEL_CONFIG.options,
        max_length: maxTokens,
        max_new_tokens: Math.min(128, maxTokens - tokenCount) // Ensure we don't exceed context window
      };

      const result = await this.generator(prompt, generationOptions);
      console.log('Response generated:', result);

      if (!result?.[0]?.generated_text) {
        throw new Error('Invalid response format');
      }

      let response = result[0].generated_text;
      
      // Remove the prompt from the response
      if (response.startsWith(prompt)) {
        response = response.slice(prompt.length);
      }
      
      response = response.trim();
      
      return response || "I apologize, but I couldn't generate a meaningful response. Please try again.";

    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }
}

export const modelManager = ModelManager.getInstance();