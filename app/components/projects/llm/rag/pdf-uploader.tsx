'use client'

import { useState, useRef } from 'react';

interface PDFUploaderProps {
    onUpload: (file: File) => Promise<void>;
    isLoading?: boolean;
    disabled?: boolean;
}

export function PDFUploader({ onUpload, isLoading = false, disabled = false }: PDFUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (file.type === 'application/pdf') {
            await onUpload(file);
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) {
            await handleFile(files[0]);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`px-3 py-2 rounded border-2 border-dashed transition-colors text-sm ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-300 dark:border-gray-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}`}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                disabled={isLoading || disabled}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || disabled}
                className="text-xs font-medium hover:underline disabled:opacity-50"
            >
                {isLoading ? '⏳ Processing...' : '📤 Upload PDF'}
            </button>
        </div>
    );
}
