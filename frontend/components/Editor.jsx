import {EditorContent, FloatingMenu, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {QuestionNode} from "./editor-nodes/QuestionNode.jsx";
import React, {useEffect} from "react";

export const Editor = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            QuestionNode,
        ],
        content: `
        <h1>Title</h1>
        <question-node question="What is 1+2?" answer="3">
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
        <section className="p-0 px-0">
            <div>
                <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)}/>
                Editable
            </div>
            {editor && <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                    className={editor.isActive('heading', {level: 1}) ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    Heading 1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                    className={editor.isActive('heading', {level: 2}) ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    Heading 2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    Bullets
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('questionNode') ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    Question
                </button>
            </FloatingMenu>}
            <EditorContent editor={editor}/>
        </section>
    )
}