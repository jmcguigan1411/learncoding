import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language = "python",
  theme = "vs-dark",
  height = "300px"
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // In a production environment, you would integrate Monaco Editor here
    // For now, we'll use a styled textarea as a placeholder
    if (editorRef.current) {
      editorRef.current.value = value;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = start + 4;
          editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={editorRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none border-0"
        style={{ height }}
        placeholder="# Write your Python code here..."
        spellCheck={false}
      />
      
      {/* Line numbers (simplified) */}
      <div className="absolute left-0 top-0 p-4 text-xs text-gray-500 font-mono pointer-events-none">
        {value.split('\n').map((_, index) => (
          <div key={index} style={{ height: '21px' }}>
            {index + 1}
          </div>
        ))}
      </div>
      
      {/* Add left padding to make room for line numbers */}
      <style jsx>{`
        textarea {
          padding-left: 3rem;
        }
      `}</style>
    </div>
  );
}
