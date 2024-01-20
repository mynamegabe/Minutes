import React from "react";

export function QuizCard({question, answer}) {
    console.log(question, answer)
    return (
        <>
           <div>Quiz Card</div>
        <p>{question}</p>
        <p>{answer}</p>
        </>
    )
}