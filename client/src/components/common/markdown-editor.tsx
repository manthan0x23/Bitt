import MDEditor from '@uiw/react-md-editor';
import { Label } from '@/components/ui/label';
import { useStore } from '@tanstack/react-store';
import { themeStore } from '@/store/themeStore';

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({
  label,
  value,
  onChange,
  placeholder = 'Write your job description here...',
}: MarkdownEditorProps) => {
  const { theme } = useStore(themeStore);

  return (
    <div className="space-y-2 w-full">
      {label && <Label>{label}</Label>}
      <div
        className="rounded-md border p-2"
        data-color-mode={theme === 'dark' ? 'dark' : 'light'}
      >
        <MDEditor
          value={value}
          onChange={(val = '') => onChange(val)}
          height={300}
          preview="edit"
          textareaProps={{
            placeholder,
          }}
        />
      </div>
    </div>
  );
};
