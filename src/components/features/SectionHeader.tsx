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

      <div className="flex items-center pr-[clamp(14px,3vw,20px)]">
        <button
          onClick={onToggleCollapse}
          className="flex-1 flex items-center gap-2 px-4 py-3 text-left rounded-lg hover:bg-white/[0.03] transition-colors duration-200 group"
        >
          {isCollapsed ? (
            <ChevronRight size={18} className="text-white/60" />
          ) : (
            <ChevronDown size={18} className="text-white/60" />
          )}
          <h3 className="text-sm font-bold text-white/90 uppercase tracking-wide">
            {title}
          </h3>
{itemCount > 0 && (
            <span className="text-white/50 text-xs ml-auto bg-white/10 px-2 py-0.5 rounded-full">
              {checkedCount}/{itemCount}
            </span>
          )}
        </button>

        {/* Menu Button */}
        <button
          onClick={() => setIsOptionsMenuOpen(true)}
          className="text-white/50 hover:text-white/80 p-1 transition-colors duration-150 shrink-0"
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
