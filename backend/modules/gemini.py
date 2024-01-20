import config

import textwrap
from IPython.display import Markdown
import google.generativeai as genai

genai.configure(api_key=config.MAKERSUITE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))


def queryGemini(query):
  response = model.generate_content(query)
  return response


def generateQuestions(content):
  prompt_parts = [
    content,
    "\nBased on the content, generate questions and answers in the format of:",
    "\nQ: question",
    "\nA: answer",
  ]
  response = model.generate_content(prompt_parts)
  return response.text


def generateSummary(content):
  prompt_parts = [
    content,
    "\nBased on the content, generate a summary.",
  ]
  response = model.generate_content(prompt_parts)
  return response.text


def answerQuestion(question, content):
  prompt_parts = [
    content,
    "\nQ: " + question,
  ]
  response = model.generate_content(prompt_parts)
  return response.text


def generateMCQ(content, questions_n=1, options_n=4):
  prompt_parts = [
    content,
    f"\nBased on the content, generate {questions_n} multiple choice questions with {options_n} numerical options in the format of:",
    "\nQ{number}: question",
    "\nAnswer: answer",
    "\nn: option n",
    "\nDELIMITER"
  ]
  response = model.generate_content(prompt_parts)
  print(response.text)
  return response.text


def verifyAnswer(question, answer, expected):
  prompt_parts = [
    "Q: " + question,
    "\nA: " + answer,
    "\nExpected: " + expected,
    "\nIf the answer is correct, reply with 'correct'. Otherwise, reply with 'incorrect'."
  ]
  response = model.generate_content(prompt_parts)
  print(response.prompt_feedback)
  return response.text == "correct"