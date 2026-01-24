import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'font-medium rounded-lg transition-colors',
        'focus:outline-none focus:ring-2',
        // Size variants
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        // Color variants - glass theme
        variant === 'primary' && 'bg-white/20 text-white hover:bg-white/25 focus:ring-white/50 border border-white/30',
        variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/15 focus:ring-white/50 border border-white/20',
        variant === 'danger' && 'bg-red-500/20 text-red-400 hover:bg-red-500/30 focus:ring-white/50 border border-red-500/30',
        // Disabled state
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
