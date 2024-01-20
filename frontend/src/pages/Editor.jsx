// src/Tiptap.jsx
import React from "react";
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";

// define your extension array
const extensions = [
  StarterKit.configure({
    // text: 'Type something...?',
  })
]

const content = '<p>Type something...</p>'

// Text Editor that uses tiptap
export function Editor(props) {
    const editor = useEditor({
        extensions: [
          StarterKit,
        ],
        content: `
          <p>
          Type something...
          </p>
          <p></p>
        `,
      });
    return (
        <EditorProvider extensions={extensions} content={content}>
            {/* <FloatingMenu>This is the floating menu</FloatingMenu>
            <BubbleMenu>This is the bubble menu</BubbleMenu> */}
        </EditorProvider>
    );
}