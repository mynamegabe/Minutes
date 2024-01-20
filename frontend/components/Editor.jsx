"use client";

import {BubbleMenu, EditorContent, FloatingMenu, useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {QuestionNode} from "./editor-nodes/QuestionNode.jsx";
import React, {useEffect, useState} from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";


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

    const [isEditable, setIsEditable] = useState(true)
    const [selectedText, setSelectedText] = useState('')
    const [mode, setMode] = useState('Notetaking') // 'Notetaking' or 'Read-only'
    console.log(selectedText)
    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable)
        }

        // document.querySelectorAll('question-node').forEach((node) => {
        //     node.setAttribute('disabled', false)
        //     node.setAttribute('contentEditable', false)
        // })

    }, [isEditable, editor])

    return (
        <section className="py-4 px-0 min-w-7xl flex-grow">
            {/* <div>
                <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)}/>
                Editable
            </div> */}
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                    variant="bordered" 
                    >
                    {mode}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Modes"
                onAction={(key) => {
                    setMode(key)
                    setIsEditable(key === 'Notetaking')
                }}
                >
                    <DropdownItem key="Notetaking">Notetaking</DropdownItem>
                    <DropdownItem key="Read-only">Read-only</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            {
                editor && <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
                    <button
                    onClick={() => setSelectedText(window.getSelection().toString())}
                    className="bg-rose-500 hover:bg-rose-700 text-white px-2 py-1 rounded-md shadow"
                    >
                        Generate
                    </button>
                </BubbleMenu>
            }
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
                    onClick={() => {
                        editor.commands.insertContent('<question-node question="" answer="">Hello</question-node>');
                    }}
                    className={editor.isActive('questionNode') ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    Question
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active floating-menu-button' : 'floating-menu-button'}
                >
                    Bullets
                </button>
            </FloatingMenu>}
            <EditorContent editor={editor}/>
        </section>
    )
}