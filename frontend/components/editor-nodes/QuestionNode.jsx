const className = 'question-node';
export const QuestionNode = Node.create({
    name: 'questionNode',
    group: 'block',
    content: 'inline*',
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
    const handleUserQuestion = (event) => {
        props.updateAttributes({
            question: event.target.value
        });
    };
    const handleUserAnswer = (event) => {
        props.updateAttributes({
            answer: event.target.value
        });
    };
    return <NodeViewWrapper className={className}>
        <div>
            <label contentEditable={false}>Question:</label>
            <div className="question-node__question">
                <input type="text" value={props.node.attrs.question} onChange={handleUserQuestion}/>
            </div>
            {/*<NodeViewContent className="question-node__question"/>*/}
            <br/>
            <label contentEditable={false}>Expected Answer:</label>
            <div className="question-node__answer">
                <input type="text" value={props.node.attrs.answer} onChange={handleUserAnswer}/>
            </div>
        </div>
    </NodeViewWrapper>
}