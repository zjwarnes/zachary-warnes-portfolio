'use client'

import { useEffect, useState } from 'react';
import type { InitProgressReport, ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { ChatWindow } from '../chat-window';
import { modelManager } from '../llm-initialization';
import { useModelCleanup } from '../model-cleanup';
import { embeddingManager } from './embedding-manager';
import { ResourceMonitor } from './resource-monitor';
import type { RAGMessage, TextChunk, ResourceMetrics } from './types';
import { PDFUploader } from './pdf-uploader';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    sources?: TextChunk[];
}

const SYSTEM_PROMPT = `You are a helpful AI assistant with access to document context.
Use the provided context to answer questions accurately and helpfully.
If the context doesn't contain relevant information, say so clearly.
Always cite the document chunks you reference when available.
Keep responses concise and focused.`;

const MAX_CONTEXT_LENGTH = 2000;
const MAX_RESPONSE_LENGTH = 500;

export function RAGLLMDemo() {
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isProcessingPDF, setIsProcessingPDF] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingProgress, setLoadingProgress] = useState<string>('');
    const [resourceMetrics, setResourceMetrics] = useState<ResourceMetrics | null>(null);
    const [embeddingsInitialized, setEmbeddingsInitialized] = useState(false);
    const [documentName, setDocumentName] = useState<string>('');
    const [chunkCount, setChunkCount] = useState(0);

    useModelCleanup();

    // Initialize embedding model on component mount
    useEffect(() => {
        const initEmbeddings = async () => {
            try {
                await embeddingManager.initialize();
                setEmbeddingsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize embeddings:', error);
            }
        };

        initEmbeddings();
    }, []);

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
                content: "I'm ready! You can now upload a PDF document or ask me questions. The document will be processed locally in your browser, and I'll use it to provide more accurate answers."
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

    const handlePDFUpload = async (file: File) => {
        setIsProcessingPDF(true);
        try {
            // Dynamically import PDFParser only when needed
            const { PDFParser } = await import('./pdf-parser');

            // Extract text from PDF
            const text = await PDFParser.extractText(file);
            console.log('Extracted text length:', text.length);

            // Chunk the text
            const chunks = PDFParser.chunkText(text);
            console.log('Created chunks:', chunks.length);

            // Update resource metrics
            const metrics = ResourceMonitor.estimateResourceMetrics(chunks.length);
            setResourceMetrics(metrics);

            // Embed chunks
            const embedded = await embeddingManager.embedChunks(chunks);
            setChunkCount(embedded.length);
            setDocumentName(file.name);

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `✅ Document processed! Loaded ${embedded.length} chunks from "${file.name}". You can now ask questions about the document.`
            }]);
        } catch (error) {
            console.error('Error processing PDF:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Error processing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
            }]);
        } finally {
            setIsProcessingPDF(false);
        }
    };

    const handleSendMessage = async (userMessage: string) => {
        if (isGenerating) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        setIsGenerating(true);
        try {
            // Retrieve relevant context from embeddings
            let context = '';
            let sources: TextChunk[] = [];

            if (chunkCount > 0) {
                try {
                    const relevantChunks = await embeddingManager.retrieveRelevantChunks(userMessage);
                    if (relevantChunks.length > 0) {
                        sources = relevantChunks;
                        context = relevantChunks
                            .map((chunk, idx) => `[Source ${idx + 1}, Page ${chunk.pageNumber || 'N/A'}]:\n${chunk.text}`)
                            .join('\n\n')
                            .substring(0, MAX_CONTEXT_LENGTH);
                    }
                } catch (ragError) {
                    console.warn('Error retrieving document context:', ragError);
                    // Continue without context if embedding lookup fails
                }
            }

            // Construct prompt with context
            const prompt = context
                ? `Context from document:\n${context}\n\nUser question: ${userMessage}`
                : userMessage;

            // Generate response
            const result = await modelManager.generateResponse(SYSTEM_PROMPT, prompt);
            const truncatedResult = result.substring(0, MAX_RESPONSE_LENGTH);

            if (!truncatedResult || truncatedResult.trim().length === 0) {
                throw new Error('Model returned empty response');
            }

            setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: truncatedResult,
                sources: sources.length > 0 ? sources : undefined
            }]);
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setMessages((prev: Message[]) => [...prev, {
                role: 'assistant',
                content: `I apologize, but I encountered an error: ${errorMessage}. Please ensure the model is initialized and try again.`
            }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleClearDocument = () => {
        embeddingManager.clearChunks();
        setChunkCount(0);
        setDocumentName('');
        setResourceMetrics(null);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Document cleared. You can upload a new one or continue chatting."
        }]);
    };

    if (!isInitialized && !isModelLoading) {
        return (
            <div className="flex items-center justify-center h-full flex-col gap-4">
                <p className="text-center text-sm max-w-md">
                    This demo runs an LLM entirely in your browser. It requires downloading ~100MB of model files.
                </p>
                <p className="text-center text-xs text-gray-500 max-w-md">
                    Optional: You can upload a PDF (up to 5MB) for RAG (Retrieval Augmented Generation) to answer questions based on your document.
                </p>
                <button
                    onClick={initModel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                    Download and Initialize Model
                </button>
            </div>
        );
    }

    if (isModelLoading) {
        return (
            <div className="flex items-center justify-center h-full flex-col gap-4">
                <p className="text-sm">Loading language model... This may take a moment.</p>
                {loadingProgress && <p className="text-xs text-gray-500">{loadingProgress}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Document Status & Upload */}
            <div className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                        {documentName ? (
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">📄 {documentName}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {chunkCount} chunks loaded • {resourceMetrics?.memoryUsage.toFixed(1)}MB estimated
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600 dark:text-gray-400">No document loaded</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <PDFUploader
                            onUpload={handlePDFUpload}
                            isLoading={isProcessingPDF}
                            disabled={!embeddingsInitialized}
                        />
                        {documentName && (
                            <button
                                onClick={handleClearDocument}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Resource Warnings */}
                {resourceMetrics && (
                    <div className={`text-xs p-2 rounded ${resourceMetrics.warningLevel === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        resourceMetrics.warningLevel === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                        {ResourceMonitor.getResourceWarning(resourceMetrics) || '✅ Optimal resource usage'}
                    </div>
                )}
            </div>

            {/* Chat Window */}
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
