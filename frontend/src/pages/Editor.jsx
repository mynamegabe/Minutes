import '../style/editor.css'

import {EditorContent, FloatingMenu, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {useEffect} from 'react'
import {QuestionNode} from "../components/editor-nodes/QuestionNode.jsx";

export function Editor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            QuestionNode,
        ],
        content: `
      <p>
        This is an example of a Medium-like editor. Enter a new line and some buttons will appear.
      </p>
      <p></p>
      <question-node question="what is 1-3?">
        <p>What is 1+2?</p>
      </question-node>
    `,
    });

    const [isEditable, setIsEditable] = React.useState(true)

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable)
        }
    }, [isEditable, editor])

    return (
        <>
            <div>
                <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)}/>
                Editable
            </div>
            {editor && <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                    className={editor.isActive('heading', {level: 1}) ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    h1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                    className={editor.isActive('heading', {level: 2}) ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    h2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    bullet list
                </button>
            </FloatingMenu>}
            <EditorContent editor={editor}/>
        </>
    )
}