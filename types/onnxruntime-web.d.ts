declare module 'onnxruntime-web' {
  export interface InferenceSession {
    run(feeds: { [key: string]: Tensor }): Promise<{ [key: string]: Tensor }>;
  }

  export interface Tensor {
    data: Float32Array;
    dims: number[];
  }

  export interface SessionOptions {
    executionProviders: string[];
    graphOptimizationLevel?: string;
    enableCpuMemArena?: boolean;
    enableMemPattern?: boolean;
    executionMode?: string;
  }

  export const InferenceSession: {
    create: (
      path: string,
      options?: SessionOptions
    ) => Promise<InferenceSession>;
  };

  export const env: {
    wasm: {
      init(): Promise<void>;
      wasmPaths: {
        [key: string]: string;
      };
    };
  };

  export class Tensor {
    constructor(
      type: string,
      data: Float32Array,
      dims: number[]
    );
  }
} 