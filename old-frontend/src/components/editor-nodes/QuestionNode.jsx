"use client";

const className = 'question-node';
export const QuestionNode = Node.create({
    name: 'questionNode',
    group: 'block',
    content: 'inline*',
    // atom: true,
    component: QuestionNodeView,
    parseHTML() {
        return [
            {
                tag: className,
            },
        ]
    },

    addAttributes() {
        return {
            question: {
                default: "Question?",
                parseHTML: element => {
                    return element.getAttribute('question')
                },
            },
            answer: {
                default: "",
                parseHTML: element => {
                    return element.getAttribute('answer')
                },
            }
        }
    },
    renderHTML({HTMLAttributes}) {
        return [className, mergeAttributes(HTMLAttributes), 0]
    },
    addNodeView() {
        return ReactNodeViewRenderer(QuestionNodeView);
    }
})
import {Node} from '@tiptap/core'
import React from 'react'

import {mergeAttributes, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";

export function QuestionNodeView(props) {
    const [question, setQuestion] = React.useState(props.node.attrs.question);
    const [userAnswer, setUserAnswer] = React.useState(props.node.attrs.answer);
    // const editQuestion = () => {
    //     props.updateAttributes({
    //
    //     });
    // };
    console.log(props.node.attrs.question);
    const handleUserQuestion = (event) => {
        props.updateAttributes({
            question: event.target.value
        });
    };
    const handleUserAnswer = (event) => {
        setUserAnswer(event.target.value);
    };
    return <NodeViewWrapper className={className}>
        <div>
            <label contentEditable={false}>Question:</label>
            <div className="question-node__question">
                <input type="text" value={question} onChange={handleUserQuestion}/>
            </div>
            {/*<NodeViewContent className="question-node__question"/>*/}
            <br/>
            <label contentEditable={false}>Expected Answer:</label>
            <div className="question-node__answer">
                <input type="text" value={userAnswer} onChange={handleUserAnswer}/>
            </div>
        </div>
    </NodeViewWrapper>
}