'use client'

import { SessionMetrics, StageMetrics } from './types'

interface MetricsDisplayProps {
    metrics: SessionMetrics
    metricType: 'accuracy' | 'precision' | 'recall'
}

/**
 * Component to display real-time detection and classification metrics
 */
export function MetricsDisplay({ metrics, metricType }: MetricsDisplayProps) {
    const getValue = (stage: StageMetrics) => {
        const value = (() => {
            switch (metricType) {
                case 'precision':
                    return stage.precision
                case 'recall':
                    return stage.recall
                case 'accuracy':
                default:
                    return stage.accuracy
            }
        })()
        return typeof value === 'number' ? value : 0
    }

    const detectionValue = getValue(metrics.detection)
    const classificationValue = getValue(metrics.classification)

    const getColor = (value: number) =>
        value >= 80 ? 'from-green-500' : value >= 60 ? 'from-yellow-500' : 'from-red-500'

    const renderStageMetrics = (stage: StageMetrics, title: string) => (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wide">{title}</h4>

            {/* Main value */}
            <div className="text-center mb-3">
                <div className={`bg-gradient-to-r ${getColor(getValue(stage))} to-transparent bg-clip-text text-transparent text-3xl font-bold`}>
                    {(getValue(stage) ?? 0).toFixed(1)}%
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-[var(--color-background-dark)] rounded border border-[var(--color-border-primary)]">
                    <p className="text-[var(--color-text-secondary)]">Frames</p>
                    <p className="text-[var(--color-primary)] font-bold">{stage.totalFrames}</p>
                </div>
                <div className="p-2 bg-[var(--color-background-dark)] rounded border border-[var(--color-border-primary)]">
                    <p className="text-[var(--color-text-secondary)]">Correct</p>
                    <p className="text-green-400 font-bold">{stage.correctDetections}</p>
                </div>
                <div className="p-2 bg-[var(--color-background-dark)] rounded border border-[var(--color-border-primary)]">
                    <p className="text-[var(--color-text-secondary)]">False+</p>
                    <p className="text-red-400 font-bold">{stage.falsePositives}</p>
                </div>
                <div className="p-2 bg-[var(--color-background-dark)] rounded border border-[var(--color-border-primary)]">
                    <p className="text-[var(--color-text-secondary)]">False-</p>
                    <p className="text-orange-400 font-bold">{stage.falseNegatives}</p>
                </div>
            </div>

            {/* All metrics */}
            <div className="grid grid-cols-3 gap-1 text-xs pt-2 border-t border-[var(--color-border-primary)]">
                <div className="text-center">
                    <p className="text-[var(--color-text-secondary)]">Acc</p>
                    <p className="font-bold text-[var(--color-primary)]">{(stage.accuracy ?? 0).toFixed(0)}%</p>
                </div>
                <div className="text-center">
                    <p className="text-[var(--color-text-secondary)]">Prec</p>
                    <p className="font-bold text-[var(--color-primary)]">{(stage.precision ?? 0).toFixed(0)}%</p>
                </div>
                <div className="text-center">
                    <p className="text-[var(--color-text-secondary)]">Rec</p>
                    <p className="font-bold text-[var(--color-primary)]">{(stage.recall ?? 0).toFixed(0)}%</p>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Real-time Metrics</h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Detection Stage */}
                <div className="p-4 bg-[var(--color-background-dark)] rounded-lg border border-[var(--color-border-primary)]">
                    {renderStageMetrics(metrics.detection, 'Detection Stage')}
                </div>

                {/* Classification Stage */}
                <div className="p-4 bg-[var(--color-background-dark)] rounded-lg border border-[var(--color-border-primary)]">
                    {renderStageMetrics(metrics.classification, 'Classification Stage')}
                </div>
            </div>
        </div>
    )
}
