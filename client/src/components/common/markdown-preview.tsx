import MDEditor from '@uiw/react-md-editor';
import { useStore } from '@tanstack/react-store';
import { themeStore } from '@/store/themeStore';

interface MarkdownPreviewProps {
  value: string;
  fontSize?: string; // e.g., '1rem', '14px'
  textColor?: string | null; // e.g., '#333', 'var(--text-color)'
  className?: string; // additional classes for outer container
  lineHeight?: number;
}

export const MarkdownPreview = ({
  value,
  fontSize = '1rem',
  textColor = null,
  className = '',
  lineHeight = 2,
}: MarkdownPreviewProps) => {
  const { theme } = useStore(themeStore);

  return (
    <div
      className={`pr-4 w-full ${className}`}
      data-color-mode={theme === 'dark' ? 'dark' : 'light'}
    >
      <MDEditor.Markdown
        source={value}
        style={{
          backgroundColor: 'transparent',
          fontSize,
          ...(textColor ? { color: textColor } : {}),
          lineHeight,
        }}
      />
    </div>
  );
};
