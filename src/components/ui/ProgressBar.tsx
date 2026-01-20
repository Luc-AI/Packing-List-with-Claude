import { RotateCcw } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  onReset?: () => void;
}

/**
 * ProgressBar - Orange/coral gradient progress indicator
 */
export function ProgressBar({ current, total, label, onReset }: ProgressBarProps) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4">
      {/* Progress section */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
          <span className="text-[clamp(13px,2.5vw,14px)] font-semibold text-glass-primary">
            {label || `${current} von ${total} eingepackt`}
          </span>
          <span className="text-[clamp(18px,4vw,22px)] font-bold text-glass-primary">
            {progress}%
          </span>
        </div>
        <div
          className="w-full h-[clamp(10px,2vw,12px)] rounded-xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div
            className="h-full rounded-xl transition-[width] duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'var(--progress-gradient)',
              boxShadow: 'var(--progress-shadow)',
            }}
          />
        </div>
      </div>

      {/* Reset button - neumorphic glass style */}
      {onReset && (
        <button
          onClick={onReset}
          disabled={current === 0}
          className={`w-[clamp(48px,10vw,56px)] h-[clamp(48px,10vw,56px)] rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
            current === 0
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:scale-105 active:scale-95'
          }`}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: `
              inset 0 1px 1px rgba(255, 255, 255, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.15),
              0 2px 4px rgba(0, 0, 0, 0.1)
            `,
          }}
          title={current === 0 ? 'Keine Items zum Zurücksetzen' : 'Items zurücksetzen'}
        >
          <RotateCcw size={22} className="text-white/70" />
        </button>
      )}
    </div>
  );
}
