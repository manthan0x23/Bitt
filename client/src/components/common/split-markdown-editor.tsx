import { themeStore } from '@/store/themeStore';
import { useStore } from '@tanstack/react-store';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

export function SplitMarkdownEditor({
  value,
  onChange,
  height = 400,
  placeholder = 'Write the job description in markdown...',
}: {
  value: string;
  onChange: (val: string) => void;
  height?: number;
  placeholder?: string;
}) {
  const { theme } = useStore(themeStore);

  return (
    <div className="flex w-full gap-4">
      <div className="w-1/2">
        <MDEditor
          data-color-mode={theme === 'dark' ? 'dark' : 'light'}
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview="edit"
          textareaProps={{ placeholder }}
        
        />
      </div>

      <div
        className={`w-1/2 p-2 border rounded-md overflow-auto ${
          theme === 'dark' ? 'bg-[#0d1117] text-white' : 'bg-white text-black'
        }`}
      >
        <MDEditor.Markdown
          source={value}
          style={{
            backgroundColor: theme === 'dark' ? '#0d1117' : 'white',
            color: theme === 'dark' ? 'white' : 'black',
            whiteSpace: 'pre-wrap',
            padding: '1rem',
            borderRadius: '0.5rem',
          }}
        />
      </div>
    </div>
  );
}
