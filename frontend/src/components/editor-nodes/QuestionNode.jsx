const className = 'question-node';
export const QuestionNode = Node.create({
    name: 'questionNode',
    group: 'block',
    content: 'inline*',
    atom: true,
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
                // parseHTML: element => {
                //     return {
                //         question: element.getAttribute('question'),
                //     }
                // },
            },
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
    // const editQuestion = () => {
    //     props.updateAttributes({
    //
    //     });
    // };
    console.log(props.node.attrs.question);
    return <NodeViewWrapper className={className}>
        <div contentEditable={true} className="question-node">
            <NodeViewContent className="question-node__question"/>
            <div className="question-node__answer">
                {/*<input type="text" value="3"/>*/}
            </div>
        </div>
    </NodeViewWrapper>
}