export interface TextChunk {
    id: string;
    text: string;
    pageNumber?: number;
    startIndex: number;
}

export interface EmbeddedChunk extends TextChunk {
    embedding: number[];
}

export interface RAGContext {
    chunks: EmbeddedChunk[];
    documentName?: string;
}

export interface RAGMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: TextChunk[];
}

export interface ResourceMetrics {
    memoryUsage: number;
    estimatedChunks: number;
    warningLevel: 'safe' | 'warning' | 'critical';
}
