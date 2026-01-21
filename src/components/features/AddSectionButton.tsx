import { Plus } from 'lucide-react';

interface AddSectionButtonProps {
  onClick: () => void;
}

export function AddSectionButton({ onClick }: AddSectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="glass-button-dashed w-full flex items-center justify-center gap-2 py-[clamp(16px,3vw,20px)] px-[clamp(20px,4vw,28px)]"
    >
      <Plus size={20} className="text-white/60" />
      <span
        className="text-[clamp(14px,3vw,16px)] font-medium text-white/60"
        style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}
      >
        Neuer Abschnitt
      </span>
    </button>
  );
}
