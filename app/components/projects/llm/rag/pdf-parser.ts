'use client'

import type { TextChunk } from './types';

let pdfjsLib: any = null;
let isInitialized = false;

// Lazy load PDF.js only when needed
async function initPDFJS() {
    if (isInitialized) return;
    if (typeof window === 'undefined') {
        throw new Error('PDF.js can only be used in the browser');
    }

    try {
        // Use dynamic import with a try-catch to handle module issues
        const pdfjs = await import('pdfjs-dist');
        pdfjsLib = pdfjs;

        // Set worker from CDN
        if (pdfjsLib.GlobalWorkerOptions) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        isInitialized = true;
    } catch (error) {
        console.error('Failed to load PDF.js:', error);
        throw new Error('Failed to initialize PDF parser. Please refresh and try again.');
    }
}

const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB
const CHUNK_SIZE = 500; // characters per chunk
const CHUNK_OVERLAP = 100; // characters of overlap between chunks

export class PDFParser {
    static validateFile(file: File): { valid: boolean; error?: string } {
        if (file.type !== 'application/pdf') {
            return { valid: false, error: 'File must be a PDF' };
        }
        if (file.size > MAX_PDF_SIZE) {
            return {
                valid: false,
                error: `File size exceeds 5MB limit. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`
            };
        }
        return { valid: true };
    }

    static async extractText(file: File): Promise<string> {
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        await initPDFJS();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += `\n[Page ${pageNum}]\n${pageText}`;
        }

        return fullText;
    }

    static chunkText(text: string, chunkSize: number = CHUNK_SIZE, overlap: number = CHUNK_OVERLAP): TextChunk[] {
        const chunks: TextChunk[] = [];
        let chunkId = 0;

        for (let i = 0; i < text.length; i += chunkSize - overlap) {
            const chunk = text.substring(i, i + chunkSize);

            if (chunk.trim().length > 0) {
                chunks.push({
                    id: `chunk_${chunkId}`,
                    text: chunk,
                    startIndex: i,
                    pageNumber: this.extractPageNumber(text.substring(0, i))
                });
                chunkId++;
            }

            if (i + chunkSize >= text.length) {
                break;
            }
        }

        return chunks;
    }

    private static extractPageNumber(textUpToPoint: string): number {
        const pageMatches = textUpToPoint.match(/\[Page (\d+)\]/g);
        if (pageMatches && pageMatches.length > 0) {
            const lastMatch = pageMatches[pageMatches.length - 1];
            const pageNum = lastMatch.match(/\d+/)?.[0];
            return pageNum ? parseInt(pageNum) : 1;
        }
        return 1;
    }
}
