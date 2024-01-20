import {Card, CardBody, Input} from "@nextui-org/react";

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
import React, {useEffect} from 'react'

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
        {/* <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md p-2 dark:bg-[#0B0508] dark:border-white">
            <label contentEditable={false}>Question:</label>
            <div className="question-node__question">
                <input type="text" value={props.node.attrs.question} onChange={handleUserQuestion}/>
            </div>
            <br/>
            <label contentEditable={false}>Expected Answer:</label>
            <div className="question-node__answer">
                <input type="text" value={props.node.attrs.answer} onChange={handleUserAnswer}/>
            </div>
        </div> */}
        <Card shadow>
            <CardBody>
                <label contentEditable={false} className="text-sm">Question:</label>
                <div className="question-node__question">
                    <Input type="text" value={props.node.attrs.question} onChange={handleUserQuestion}
                    classNames={{
                        input: 'border-0 outline-none focus:outline-none'
                    }}
                    />
                </div>
                <br/>
                <label contentEditable={false} className="text-sm">Answer</label>
                <div className="question-node__answer">
                    <Input type="text" value={props.node.attrs.answer} onChange={handleUserAnswer}
                    classNames={{
                        input: 'border-0 outline-none focus:outline-none'
                    }}/>
                </div>
            </CardBody>
        </Card>
    </NodeViewWrapper>
}