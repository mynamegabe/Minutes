import re

def parseQuestions(text):
    lines = text.splitlines()
    lines = list(filter(None, lines))
    # questions = list(filter(lambda line: line.startswith("Q: "), lines))
    # questions = list(map(lambda line: line[3:], lines))

    questions = filter(lambda x: x.startswith('Q: '), lines)
    questions = list(map(lambda x: x[3:], questions))
    # print(questions)
    # answers = list(filter(lambda line: line.startswith("A: "), lines))
    # answers = list(map(lambda line: line[3:], lines))
    answers = filter(lambda x: x.startswith('A: '), lines)
    answers = list(map(lambda x: x[3:], answers))
    # print(answers)

    return [
        {questions[i]: answers[i]} for i in range(len(questions))
    ]


def parseMCQ(text):
    mcqs = []
    lines = text.split("DELIMITER")
    lines = list(filter(None, lines))
    for i in range(len(lines)):
        lines[i] = lines[i].splitlines()
        lines[i] = list(filter(None, lines[i]))
        question = re.search(r"Q(?:\d+)?: (.*)", lines[i][0]).group(1)
        answer = re.search(r"Answer: (.*)", lines[i][1]).group(1)
        options = []
        for j in range(2, len(lines[i])):
            options.append(re.search(r"\d+: (.*)", lines[i][j]).group(1))
        mcq = {
            "question": question,
            "answer": answer,
            "options": options,
        }
        mcqs.append(mcq)
    return mcqs