import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Checkbox - Glassmorphism style checkbox with green gradient when checked
 */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={cn(
            'w-[clamp(24px,4vw,26px)] h-[clamp(24px,4vw,26px)] rounded-[9px] flex items-center justify-center transition-all duration-200',
            'peer-focus:ring-2 peer-focus:ring-white/50 peer-focus:ring-offset-2 peer-focus:ring-offset-transparent'
          )}
          style={
            checked
              ? {
                  background: 'var(--check-gradient)',
                  boxShadow: 'var(--check-shadow), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                }
              : {
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '2.5px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                }
          }
        >
          {checked && <Check size={17} color="white" strokeWidth={3} />}
        </div>
      </div>
      {label && (
        <span
          className={cn(
            'text-[clamp(14px,3vw,16px)] transition-all duration-200',
            checked
              ? 'text-glass-muted line-through decoration-white/40 font-normal'
              : 'text-white font-medium'
          )}
          style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
        >
          {label}
        </span>
      )}
    </label>
  );
}
