import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-glass-secondary mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 rounded-lg transition-colors',
            'bg-white/10 border border-white/30 text-white placeholder-white/50',
            'focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent',
            'backdrop-blur-sm',
            error
              ? 'border-red-400 focus:ring-red-400/50'
              : 'hover:border-white/40',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-300">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
