// src/Tiptap.jsx
import React from "react";
import { EditorProvider, FloatingMenu, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";

// define your extension array
const extensions = [
  StarterKit,
]

const content = '<p>Hello World!</p>'

// Text Editor that uses tiptap
export function Editor(props) {
    return (
        <EditorProvider extensions={extensions} content={content}>
            {/* <FloatingMenu>This is the floating menu</FloatingMenu>
            <BubbleMenu>This is the bubble menu</BubbleMenu> */}
        </EditorProvider>
    );
}