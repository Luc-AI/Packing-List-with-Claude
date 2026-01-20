import { Plus } from 'lucide-react';

interface AddItemButtonProps {
  onClick: () => void;
  label?: string;
}

/**
 * AddItemButton - Dashed glass button for adding new items
 * Uses .glass-button-dashed class for consistent styling with desktop enhancement
 */
export function AddItemButton({ onClick, label = 'Neues Item hinzufügen' }: AddItemButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-[clamp(14px,3vw,18px)] rounded-[clamp(14px,3vw,20px)] text-white text-[clamp(14px,2.8vw,15px)] font-semibold cursor-pointer flex items-center justify-center gap-2 min-h-[52px] glass-button-dashed"
    >
      <Plus size={20} />
      {label}
    </button>
  );
}
