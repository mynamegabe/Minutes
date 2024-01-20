import re

def parseQuestions(text):
    lines = text.splitlines()
    print(lines)
    lines = list(filter(None, lines))
    questions = list(filter(lambda line: line.startswith("Q: "), lines))
    questions = list(map(lambda line: line[3:], lines))
    # print(questions)
    answers = list(filter(lambda line: line.startswith("A: "), lines))
    answers = list(map(lambda line: line[3:], lines))
    # print(answers)

    return [
        {questions[i]: answers[i]} for i in range(len(questions))
    ]