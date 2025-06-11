import { X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type TagsInputProps = {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
};

export function TagsInput({
  value = [],
  onChange,
  placeholder,
}: TagsInputProps) {
  const [tags, setTags] = useState<string[]>(value);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange?.(tags);
  }, [tags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTags = input
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && !tags.includes(tag));
      if (newTags.length) {
        setTags([...tags, ...newTags]);
        setInput('');
      }
    } else if (e.key === 'Backspace' && input === '') {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 border border-input  rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <Badge key={i} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button
            onClick={() => removeTag(i)}
            type="button"
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}
      <Input
        multiple
        ref={inputRef}
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 m-0 h-auto"
        placeholder={placeholder || 'Type and press Enter or comma'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
