import { useState, useRef } from 'react';

interface GhostItemButtonProps {
  onAdd: (text: string) => void;
}

export function GhostItemButton({ onAdd }: GhostItemButtonProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) {
      onAdd(text.trim());
      setText('');
      // Keep focus to add another item
    } else if (e.key === 'Escape') {
      setText('');
      inputRef.current?.blur();
    }
  };

  const handleBlur = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <div
      className="flex items-center p-[clamp(14px,3vw,18px)] px-[clamp(14px,3vw,20px)] min-h-[56px] cursor-text group"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Placeholder for drag handle alignment */}
      <div className="mr-[clamp(8px,2vw,12px)] shrink-0 w-[20px]" />

      {/* Ghost checkbox */}
      <div
        className="w-[clamp(24px,4vw,26px)] h-[clamp(24px,4vw,26px)] rounded-[9px] flex items-center justify-center mr-[clamp(10px,2.5vw,14px)] shrink-0 transition-all duration-200 border-2 border-dashed border-white/20"
      />

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Neues Item"
        className="flex-1 bg-transparent border-none outline-none text-glass-muted placeholder-white/30 focus:ring-0 p-0 text-[clamp(14px,3vw,16px)]"
        style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
      />
    </div>
  );
}
