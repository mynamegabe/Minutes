import React from "react";
import {Card, CardBody, Input, Button} from "@nextui-org/react";
import config from "@/config";

export function QuizCard({question, expectedAnswer}) {
    const [userAnswer, setUserAnswer] = React.useState('')
    const [userCorrect, setUserCorrect] = React.useState(undefined)
    function handleUserAnswer(event) {
        setUserAnswer(event.target.value)
    }

    async function onSubmitEvent(event) {
        event.preventDefault()
        // post to backend
        fetch(`${config.API_URL}/api/verify`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                question: String(question),
                answer: String(userAnswer),
                expected: String(expectedAnswer)
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            const correct = data.msg;
            console.log("correct: " + correct)
            if (correct === false) {
                setUserAnswer('')
            }
            setUserCorrect(correct)
        }).catch((error) => {
            console.log(error)
        })
    }

    return <Card shadow>
        <CardBody>
            {userCorrect !== undefined && <label contentEditable={false} className="text-sm">{userCorrect ? "Correct" : "Wrong"}</label>}
            <label contentEditable={false} className="text-sm">
                {question}
            </label>
            <br/>
            <label contentEditable={false} className="text-sm">Answer</label>
            <form onSubmit={onSubmitEvent}>
            <Input type="text" value={userAnswer} onChange={handleUserAnswer}
                   classNames={{
                       input: 'border-0 outline-none focus:outline-none'
                   }}/>
            {/*<div className="question-node__answer">*/}
            {/*</div>*/}
                <Button type="submit" className="mt-4" color="primary">Submit</Button>
            </form>
        </CardBody>
    </Card>;
}