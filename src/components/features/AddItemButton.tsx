import { Plus } from 'lucide-react';

interface AddItemButtonProps {
  onClick: () => void;
  label?: string;
}

/**
 * AddItemButton - Dashed glass button for adding new items
 */
export function AddItemButton({ onClick, label = 'Neues Item hinzufügen' }: AddItemButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-[clamp(14px,3vw,18px)] rounded-[clamp(14px,3vw,20px)] text-white text-[clamp(14px,2.8vw,15px)] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-200 min-h-[52px] group"
      style={{
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '2px dashed rgba(255, 255, 255, 0.35)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)',
      }}
      onMouseOver={(e) => {
        const target = e.currentTarget;
        target.style.background = 'rgba(255, 255, 255, 0.18)';
        target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        target.style.transform = 'translateY(-2px)';
        target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        const target = e.currentTarget;
        target.style.background = 'rgba(255, 255, 255, 0.12)';
        target.style.borderColor = 'rgba(255, 255, 255, 0.35)';
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
      }}
    >
      <Plus size={20} />
      {label}
    </button>
  );
}
