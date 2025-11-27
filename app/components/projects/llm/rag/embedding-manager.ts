'use client'

import type { EmbeddedChunk, TextChunk } from './types';
import type { Pipeline } from '@xenova/transformers';

const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
const SIMILARITY_THRESHOLD = 0.3;
const MAX_CHUNKS_TO_RETRIEVE = 3;

class EmbeddingManager {
    private extractor: any = null;
    private initPromise: Promise<void> | null = null;
    private embeddedChunks: EmbeddedChunk[] = [];

    async initialize(): Promise<void> {
        if (this.extractor) return;

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise<void>(async (resolve, reject) => {
            try {
                console.log('Initializing embedding model...');
                // Dynamically import pipeline to avoid server-side issues
                const transformers = await import('@xenova/transformers');
                const { pipeline, env } = transformers;

                // Configure the environment to use the correct CDN
                env.allowLocalModels = false;
                env.allowRemoteModels = true;
                env.remoteModels = true;

                this.extractor = await pipeline('feature-extraction', EMBEDDING_MODEL, {
                    quantized: true,
                });
                console.log('Embedding model ready');
                resolve();
            } catch (error) {
                console.error('Failed to initialize embedding model:', error);
                this.initPromise = null;
                reject(error);
            }
        });

        return this.initPromise;
    }

    async embedChunks(chunks: TextChunk[]): Promise<EmbeddedChunk[]> {
        if (!this.extractor) {
            throw new Error('Embedding manager not initialized');
        }

        const embedded: EmbeddedChunk[] = [];

        for (const chunk of chunks) {
            try {
                const result = await this.extractor(chunk.text, {
                    pooling: 'mean',
                    normalize: true
                });

                // Convert tensor to array
                const embedding = Array.from(result.data as Float32Array).map(x => Number(x));

                embedded.push({
                    ...chunk,
                    embedding
                });
            } catch (error) {
                console.error(`Failed to embed chunk ${chunk.id}:`, error);
            }
        }

        this.embeddedChunks = embedded;
        return embedded;
    }

    async retrieveRelevantChunks(query: string): Promise<TextChunk[]> {
        if (!this.extractor || this.embeddedChunks.length === 0) {
            return [];
        }

        try {
            const queryResult = await this.extractor(query, {
                pooling: 'mean',
                normalize: true
            });
            const queryEmbedding = Array.from(queryResult.data as Float32Array).map(x => Number(x));

            // Calculate similarity scores
            const scores = this.embeddedChunks.map(chunk => ({
                chunk: chunk as TextChunk,
                score: this.cosineSimilarity(queryEmbedding, chunk.embedding)
            }));

            // Sort by similarity and filter
            const relevant = scores
                .filter(s => s.score > SIMILARITY_THRESHOLD)
                .sort((a, b) => b.score - a.score)
                .slice(0, MAX_CHUNKS_TO_RETRIEVE)
                .map(s => s.chunk);

            return relevant;
        } catch (error) {
            console.error('Error retrieving chunks:', error);
            return [];
        }
    }

    private cosineSimilarity(a: number[], b: number[]): number {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator > 0 ? dotProduct / denominator : 0;
    }

    clearChunks(): void {
        this.embeddedChunks = [];
    }

    getChunkCount(): number {
        return this.embeddedChunks.length;
    }
}

export const embeddingManager = new EmbeddingManager();
