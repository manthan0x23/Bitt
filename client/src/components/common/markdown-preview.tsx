import MDEditor from '@uiw/react-md-editor';
import { useStore } from '@tanstack/react-store';
import { themeStore } from '@/store/themeStore';

interface MarkdownPreviewProps {
  value: string;
}

export const MarkdownPreview = ({ value }: MarkdownPreviewProps) => {
  const { theme } = useStore(themeStore);

  return (
    <div
      className="pr-4 w-full"
      data-color-mode={theme === 'dark' ? 'dark' : 'light'}
    >
      <MDEditor.Markdown
        source={value}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};
