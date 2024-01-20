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