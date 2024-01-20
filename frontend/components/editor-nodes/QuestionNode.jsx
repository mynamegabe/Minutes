import {Card, CardBody, Input} from "@nextui-org/react";
import {Node} from '@tiptap/core'
import React, {useEffect, useState} from 'react'

import {mergeAttributes, NodeViewWrapper, ReactNodeViewRenderer} from "@tiptap/react";
import {QuizCard} from "@/components/editor-nodes/QuizCard";

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

export function QuestionNodeView(props) {
    const [editable, setEditable] = useState(true);

    function isEditableListener(event) {
        setEditable(event.detail)
    }
    ;

    useEffect(() => {
        // listen to custom event
        document.addEventListener('editable', isEditableListener)
        return () => {
            document.removeEventListener('editable', isEditableListener)
        }
    }, [props.node.editor, props.node.attrs.question, props.node.attrs.answer]);
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
        {editable && <h1>editable</h1>}
        {!editable && <h1>not editable</h1>}
        {
            editable ?
                <Card shadow>
                    <CardBody>
                        <label contentEditable={false} className="text-sm">Question:</label>
                        <div className="question-node__question">
                            <Input type="text" value={props.node.attrs.question} onChange={handleUserQuestion}
                                   classNames={{
                                       input: 'border-0 outline-none focus:outline-none overflow:word-break'
                                   }}
                            />
                        </div>
                        <br/>
                        <label contentEditable={false} className="text-sm">Answer</label>
                        <div className="question-node__answer">
                            <Input type="text" value={props.node.attrs.answer} onChange={handleUserAnswer}
                                   classNames={{
                                       input: 'border-0 outline-none focus:outline-none overflow:word-break'
                                   }}/>
                        </div>
                    </CardBody>
                </Card> :
                <QuizCard question={props.node.attrs.question} expectedAnswer={props.node.attrs.answer}/>
        }
    </NodeViewWrapper>
}