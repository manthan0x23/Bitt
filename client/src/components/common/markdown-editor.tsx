import MDEditor from '@uiw/react-md-editor';
import { Label } from '@/components/ui/label';
import { useStore } from '@tanstack/react-store';
import { themeStore } from '@/store/themeStore';

interface MarkdownEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  preview?: boolean;
  withBorder?: boolean;
  withPadding?: boolean;
  height?: number;
}

export const MarkdownEditor = ({
  label,
  value,
  onChange,
  placeholder = 'Write your job description here...',
  preview = true,
  withBorder = false,
  withPadding = false,
  height = 300,
}: MarkdownEditorProps) => {
  const { theme } = useStore(themeStore);

  return (
    <div className="space-y-2 w-full">
      {label && <Label>{label}</Label>}
      <div
        className={[
          withBorder ? 'border rounded-md' : '',
          withPadding ? 'p-2' : '',
        ].join(' ')}
        data-color-mode={theme === 'dark' ? 'dark' : 'light'}
      >
        <MDEditor
          value={value}
          onChange={(val = '') => onChange(val)}
          preview={preview ? 'live' : 'edit'}
          height={height}
          textareaProps={{ placeholder }}
          hideToolbar={true}
          visibleDragbar={true}
          highlightEnable
        />
      </div>
    </div>
  );
};
