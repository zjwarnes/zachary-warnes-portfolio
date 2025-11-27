'use client'

import type { ResourceMetrics } from './types';

export class ResourceMonitor {
    private static readonly MEMORY_WARNING_MB = 400;
    private static readonly MEMORY_CRITICAL_MB = 700;
    private static readonly SAFE_CHUNK_COUNT = 100;
    private static readonly WARNING_CHUNK_COUNT = 300;

    static getMemoryUsage(): number {
        if (typeof navigator !== 'undefined' && 'deviceMemory' in navigator) {
            return (navigator as any).deviceMemory;
        }
        return 8; // Default fallback
    }

    static estimateResourceMetrics(chunkCount: number, avgChunkSize: number = 500): ResourceMetrics {
        // Rough estimation of memory usage
        // Each chunk: text + embedding (~384 floats * 4 bytes) + overhead
        const perChunkMemoryMB = (avgChunkSize + 384 * 4) / (1024 * 1024);
        const estimatedUsageMB = chunkCount * perChunkMemoryMB;

        let warningLevel: 'safe' | 'warning' | 'critical' = 'safe';
        if (estimatedUsageMB > this.MEMORY_CRITICAL_MB) {
            warningLevel = 'critical';
        } else if (estimatedUsageMB > this.MEMORY_WARNING_MB) {
            warningLevel = 'warning';
        }

        return {
            memoryUsage: estimatedUsageMB,
            estimatedChunks: chunkCount,
            warningLevel
        };
    }

    static getResourceWarning(metrics: ResourceMetrics): string | null {
        if (metrics.warningLevel === 'critical') {
            return `⚠️ Critical: Estimated memory usage (${metrics.memoryUsage.toFixed(1)}MB) exceeds safe limits. Performance may degrade significantly.`;
        }
        if (metrics.warningLevel === 'warning') {
            return `⚠️ Warning: Estimated memory usage (${metrics.memoryUsage.toFixed(1)}MB) is elevated. Consider using a smaller PDF.`;
        }
        return null;
    }

    static canLoadMoreChunks(currentChunks: number): boolean {
        return currentChunks < this.WARNING_CHUNK_COUNT;
    }
}
