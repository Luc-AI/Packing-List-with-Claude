import { ChevronDown, ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  itemCount: number;
  checkedCount: number;
  onToggleCollapse: () => void;
  isFirst?: boolean;
}

export function SectionHeader({
  title,
  isCollapsed,
  itemCount,
  checkedCount,
  onToggleCollapse,
  isFirst = false,
}: SectionHeaderProps) {
  return (
    <div>
      {/* Divider - only show if not first section */}
      {!isFirst && <div className="h-px bg-white/10 my-2" />}

      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-white/5 transition-colors rounded-lg group"
      >
        {isCollapsed ? (
          <ChevronRight size={18} className="text-white/60" />
        ) : (
          <ChevronDown size={18} className="text-white/60" />
        )}
        <h3 className="text-sm font-bold text-white/90 uppercase tracking-wide">
          {title}
        </h3>
        <span className="text-white/40 text-sm ml-auto">
          {checkedCount}/{itemCount}
        </span>
      </button>
    </div>
  );
}
