import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'light';
  className?: string;
  onClick?: () => void;
}

/**
 * GlassCard - Glassmorphism card component
 * @param variant - 'default' for header cards, 'light' for item containers
 */
export function GlassCard({ children, variant = 'default', className, onClick }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[clamp(16px,3vw,24px)]',
        variant === 'default' ? 'glass-card' : 'glass-card-light',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
