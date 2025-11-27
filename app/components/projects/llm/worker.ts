import { WebWorkerMLCEngineHandler, MLCEngine } from "@mlc-ai/web-llm";

// Hookup an engine to a worker handler
const engine = new MLCEngine();
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};