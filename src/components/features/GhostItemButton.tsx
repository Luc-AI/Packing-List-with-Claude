import { useState, useRef } from 'react';
import { Plus } from 'lucide-react';

interface GhostItemButtonProps {
  onAdd: (text: string) => void;
}

export function GhostItemButton({ onAdd }: GhostItemButtonProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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
    setIsFocused(false);
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <div
      className="flex items-center gap-3 py-3 px-4 cursor-text group"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Placeholder for drag handle alignment */}
      <div className="w-4" />

      {/* Ghost Icon */}
      <div
        className={`
          flex-shrink-0 w-6 h-6 rounded-full border border-dashed flex items-center justify-center transition-colors
          ${isFocused ? 'border-white/60 bg-white/5' : 'border-white/20 group-hover:border-white/40'}
        `}
      >
        <Plus
          size={14}
          className={`text-white/40 ${isFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
        />
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Neues Item"
        className="flex-1 bg-transparent border-none outline-none text-white/80 placeholder-white/30 focus:ring-0 p-0 text-base"
      />
    </div>
  );
}
