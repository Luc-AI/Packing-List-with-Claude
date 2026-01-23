import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface InlineEditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  isHeading?: boolean;
}

export function InlineEditableText({
  value,
  onSave,
  placeholder = 'Text eingeben...',
  className = '',
  inputClassName = '',
  isHeading = false,
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSave(trimmedValue);
    } else {
      setEditValue(value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
        placeholder={placeholder}
        className={cn(
          'bg-white/10 border border-white/30 rounded-lg px-2 py-1 outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-200',
          isHeading
            ? 'text-[clamp(14px,3vw,16px)] font-semibold text-white'
            : 'text-[clamp(14px,3vw,16px)] text-white',
          inputClassName
        )}
        style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={cn(
        'cursor-text hover:bg-white/10 rounded px-1 -mx-1 transition-colors duration-200',
        className
      )}
    >
      {value || placeholder}
    </span>
  );
}
