import { useState } from 'react';
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react';
import { SectionOptionsMenu } from './SectionOptionsMenu';

interface SectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  itemCount: number;
  checkedCount: number;
  onToggleCollapse: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canDelete?: boolean;
  isFirst?: boolean;
}

export function SectionHeader({
  title,
  isCollapsed,
  itemCount,
  checkedCount,
  onToggleCollapse,
  onEdit,
  onDelete,
  canDelete = true,
  isFirst = false,
}: SectionHeaderProps) {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);

  return (
    <div>
      {/* Divider - only show if not first section */}
      {!isFirst && <div className="h-px bg-white/10 my-2" />}

      <div className="flex items-center">
        <button
          onClick={onToggleCollapse}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-left hover:bg-white/5 transition-colors rounded-lg group"
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

        {/* Menu Button */}
        <button
          onClick={() => setIsOptionsMenuOpen(true)}
          className="text-white/50 hover:text-white/80 p-1 mr-3 transition-colors duration-150 shrink-0"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      <SectionOptionsMenu
        isOpen={isOptionsMenuOpen}
        onClose={() => setIsOptionsMenuOpen(false)}
        onEdit={onEdit}
        onDelete={onDelete}
        canDelete={canDelete}
      />
    </div>
  );
}
