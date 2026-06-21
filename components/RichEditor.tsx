'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type Props = {
  content: string
  onChange: (content: string) => void
}

const btnStyle = (active: boolean) => ({
  background: active ? '#10B981' : '#1A1A1A',
  border: `0.5px solid ${active ? '#10B981' : '#2a2a2a'}`,
  color: active ? '#000' : '#9CA3AF',
  borderRadius: '6px',
  padding: '4px 10px',
  fontSize: '12px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
})

export default function RichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        style: [
          'min-height: 280px',
          'padding: 16px',
          'outline: none',
          'font-size: 14px',
          'line-height: 1.8',
          'color: #D1D5DB',
          'font-family: Inter, sans-serif',
        ].join(';'),
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content])

  if (!editor) return null

  return (
    <div style={{ border: '0.5px solid #2a2a2a', borderRadius: '10px', overflow: 'hidden', background: '#1A1A1A' }}>

      {/* TOOLBAR */}
      <div style={{ display: 'flex', gap: '6px', padding: '10px 12px', borderBottom: '0.5px solid #2a2a2a', flexWrap: 'wrap', background: '#111111' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={btnStyle(editor.isActive('heading', { level: 1 }))}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive('heading', { level: 2 }))}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive('heading', { level: 3 }))}>H3</button>
        <div style={{ width: '1px', background: '#2a2a2a', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive('bold'))}>G</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive('italic'))}>I</button>
        <div style={{ width: '1px', background: '#2a2a2a', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive('bulletList'))}>• Liste</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive('orderedList'))}>1. Liste</button>
        <div style={{ width: '1px', background: '#2a2a2a', margin: '0 4px' }} />
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={btnStyle(false)}>─ Sépar.</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive('blockquote'))}>❝ Citation</button>
      </div>

      {/* ÉDITEUR */}
      <EditorContent editor={editor} />

    </div>
  )
}