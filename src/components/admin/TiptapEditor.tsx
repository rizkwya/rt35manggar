import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo 
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
  placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ 
  content, 
  onChange,
  placeholder = 'Tulis isi konten di sini...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content focus:outline-none min-h-[180px] px-4 py-3 text-slate-800 text-sm overflow-y-auto leading-relaxed',
        spellcheck: 'false',
      },
    },
  });

  // Sync state with editor content if updated externally
  React.useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const toggleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleBold().run();
  };

  const toggleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleItalic().run();
  };

  const toggleStrike = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleStrike().run();
  };

  const toggleHeading = (level: 1 | 2) => (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleBulletList = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleBulletList().run();
  };

  const toggleOrderedList = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleOrderedList().run();
  };

  const toggleBlockquote = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().toggleBlockquote().run();
  };

  const undo = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().undo().run();
  };

  const redo = (e: React.MouseEvent) => {
    e.preventDefault();
    editor.chain().focus().redo().run();
  };

  return (
    <div className="w-full border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#85A389]/20 focus-within:border-[#85A389] transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border-b border-slate-200 selection:bg-transparent">
        <button
          onClick={toggleBold}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('bold') ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Tebal (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItalic}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('italic') ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Miring (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={toggleStrike}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('strike') ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Coret"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-200 mx-1" />

        <button
          onClick={toggleHeading(1)}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={toggleHeading(2)}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-200 mx-1" />

        <button
          onClick={toggleBulletList}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('bulletList') ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={toggleOrderedList}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('orderedList') ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={toggleBlockquote}
          className={`p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors ${editor.isActive('blockquote') ? 'bg-[#85A389]/20 text-[#5F8D4E]' : ''}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-200 mx-1" />

        <button
          onClick={undo}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
          title="Urungkan"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors"
          title="Ulangi"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} className="bg-white min-h-[180px]" />
    </div>
  );
};
