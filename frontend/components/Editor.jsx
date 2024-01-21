"use client";

import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import {QuestionNode} from "./editor-nodes/QuestionNode.jsx";
import React, {useEffect, useState} from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";
import { QuizCard } from "./editor-nodes/QuizCard.jsx";
import { Notification } from "@/components/Notification.jsx";

import { ChevronDown } from "lucide-react";
import config from "@/config.jsx";

// enum Mode

const modes = {
  NOTETAKING: "Notetaking",
  READ_ONLY: "Read-Only",
  QUIZ_MODE: "Quiz-Mode",
};

export const Editor = ({ data, setData }) => {
  let { title: originalTitle, content, id } = data;
  // content = JSON.parse(content)
  const [title, setTitle] = useState(originalTitle);

  function updateNotesOnDb(editor) {
    if (!editor) {
      console.log("editor is null");
      return;
    }
    const data = {
      title: title,
      content: JSON.stringify(editor ? editor.getJSON().content : []),
    };
    setData(data);
    fetch(`${config.API_URL}/api/notes/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // return response.json()
        console.log("SAVED");
      })
      .then((data) => {
        console.log("PUT", data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

// })
    const editor = useEditor({
        extensions: [
            StarterKit,
            QuestionNode,
            TiptapImage.configure({
                allowBase64: true,
                inline: true,
            })
        ],
        // content: content,
        content: {
            type: "doc",
            content: content ? content : [],
        },
        // content: `
        // <h1>Title</h1>
        // <p>Theodore II Doukas Laskaris or Ducas Lascaris (Greek: Θεόδωρος Δούκας Λάσκαρις, romanized: Theodōros Doukas Laskaris; November 1221/1222 – 16 August 1258) was Emperor of Nicaea from 1254 to 1258. He was the only child of Emperor John III Doukas Vatatzes and Empress Irene Laskarina. His mother was the eldest daughter of Theodore I Laskaris, who had established the Empire of Nicaea as a successor state to the Byzantine Empire in Asia Minor after the crusaders captured the Byzantine capital, Constantinople, during the Fourth Crusade in 1204. Theodore received an excellent education from two renowned scholars, Nikephoros Blemmydes and George Akropolites. He made friends with young intellectuals, especially with a page of low birth, George Mouzalon. Theodore began to write treatises on theological, historical and philosophical themes in his youth.</p>
        // <question-node question="What is 1+2?" answer="3">
        // </question-node>
        // <br class="ProseMirror-trailingBreak">
        // `,
        onUpdate: ({editor}) => {
            // // console.log(editor.getHTML());
            // // console.log(editor.getJSON());
            // // PUT /api/notes/{activeTab}
            // updateNotesOnDb(editor);
        },
    });
    const [isEditable, setIsEditable] = useState(true);

    useEffect(() => {
        const editableEvent = new CustomEvent("editable", {detail: isEditable});
        document.dispatchEvent(editableEvent);
    });
    const [selectedText, setSelectedText] = useState("");
    const [isQuestionGenerationLoading, setIsQuestionGenerationLoading] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [notification, setNotification] = useState("");
    const [mode, setMode] = useState(modes.NOTETAKING); // 'Notetaking' or 'Read-Only'
    const [searchQuestion, setSearchQuestion] = useState("");
    const [searchResult, setSearchResult] = useState("")
    const [imageSrc, setImageSrc] = useState("")
    const {
        isOpen: isSearchModalOpen,
        onOpen: onSearchModalOpen,
        onOpenChange: onSearchModalOpenChange
    } = useDisclosure();
    const {
        isOpen: isAddImageModalOpen,
        onOpen: onAddImageModalOpen,
        onOpenChange: onAddImageModalOpenChange
    } = useDisclosure();

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable);
        }

    }, [isEditable, editor]);

    console.log(questions);

    const generateSummary = async () => {
        setIsAILoading(true);
        let content = editor.getJSON().content;
        let final_content = "";
        for (let i = 0; i < content.length; i++) {
            console.log(content[i]);
            if (content[i].content) {
                for (let j = 0; j < content[i].content.length; j++) {
                    final_content += content[i].content[j].text;
                }
            }
        }
        console.log("final_content", final_content)
        const body = {
            query: final_content,
            type: "summary",
        };
        fetch(`${config.API_URL}/api/generate`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data);
                setIsAILoading(false);
                editor.commands.insertContent(`<p>${data.data}</p>`);
            });
    };

    const generateImage = async () => {
        setIsAILoading(true);
        let content = editor.getJSON().content;
        let final_content = "";
        for (let i = 0; i < content.length; i++) {
            console.log(content[i]);
            if (content[i].content) {
                for (let j = 0; j < content[i].content.length; j++) {
                    final_content += content[i].content[j].text;
                }
            }
        }
        const body = {
            id: id,
            content: final_content,
        };
        fetch(`${config.API_URL}/api/image/generate`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data);
                setNotification(data.data.msg);
                setIsAILoading(false);
                // editor.commands.insertContent(`<p>${data.data}</p>`);
            });
    };

    const generateQuestions = async (content) => {
        const body = {
            query: content,
            type: "questions",
        };
        setIsQuestionGenerationLoading(true);
        setIsEditable(false);
        const response = await fetch(`${config.API_URL}/api/generate`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsQuestionGenerationLoading(false);
                setIsEditable(true);
                console.log(JSON.stringify(data));
                const entries = Object.entries(data.data);
                const questionNodes = []
                for (const question of data.data) {
                    console.log("question", question)
                    const [key, value] = Object.entries(question)[0];
                    questionNodes.push(`<question-node question="${key}" answer="${value}"></question-node><br class="ProseMirror-trailingBreak">`)

                }
                // const endPos = editor.selection.anchor

                editor.commands.focus('end')
                editor.chain().insertContent(questionNodes.join(''))
                    .run()

                // editor
                //     .chain()
                //     .insertContentAt(endPos, `<question-node question="${key}" answer="${value}">Hello</question-node><br class="ProseMirror-trailingBreak">`)
                //     .focus(endPos)
                //     .run()

                // editor.commands.insertContentAt(position,
                //     `<question-node question="${key}" answer="${value}">Hello</question-node><br class="ProseMirror-trailingBreak">`
                // );
            });
    };

    function handleTitleChange(event) {
        setTitle(event.target.value)
        // updateNotesOnDb(editor)
    }

  function saveNote() {
    console.log("saveNote");
    updateNotesOnDb(editor);
  }

  function getHTMLQns(htmlString) {
    const container = document.createElement("div");
    container.innerHTML = htmlString;

    // Filter out the question-node elements
    const questionNodes = container.querySelectorAll("question-node");

    return [...questionNodes];
  }

    async function search(question) {
        setSearchResult("Loading...")
        onSearchModalOpen()
        await fetch(`${config.API_URL}/api/generate`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                question: question,
                query: editor.getText({
                    blockSeparator: "\n",
                }),
                type: "answer",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setSearchResult(data.data)
                // alert(data.data);
                // setIsAILoading(false);
                // editor.commands.insertContent(`<p>${data.data}</p>`);
            })
    }

    function handleSearchChange(event) {
        setSearchQuestion(event.target.value)
        if (event.key === 'Enter') {
            search(searchQuestion);
        }
    }

    function handleImageSrcChange(event) {
        setImageSrc(event.target.value)
    }

    return (
        <section className="px-0 min-w-7xl flex-grow">
            <Modal
                isOpen={isSearchModalOpen}
                placement="top"
                onOpenChange={onSearchModalOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{searchQuestion}</ModalHeader>
                            <ModalBody>
                                {searchResult}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isAddImageModalOpen}
                placement="top"
                onOpenChange={onAddImageModalOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{searchQuestion}</ModalHeader>
                            <ModalBody>
                            <Input id="clear-border" placeholder="Add image url" content={imageSrc} onChange={handleImageSrcChange} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" variant="light" onPress={() => {
                                    editor.commands.setImage({
                                        src: imageSrc,
                                        alt: 'A boring example image',
                                        // title: 'An example'
                                    })
                                    onClose()
                                    setImageSrc("")
                                }}>Add Image</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div
                className="flex p-4 gap-4 sticky top-16 z-50 w-full backdrop-blur-lg bg-stone-200/50 dark:bg-neutral-950/60">
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="mb-0">{mode} <ChevronDown size={16}/></Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Modes"
                        onAction={(key) => {
                            setMode(key);
                            setIsEditable(key === modes.NOTETAKING);
                        }}
                    >
                        <DropdownItem key={modes.NOTETAKING}>{modes.NOTETAKING}</DropdownItem>
                        <DropdownItem key={modes.READ_ONLY}>{modes.READ_ONLY}</DropdownItem>
                        <DropdownItem key={modes.QUIZ_MODE}>{modes.QUIZ_MODE}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="mb-0">AI {isAILoading ?
                            <Spinner size="sm" color="default" labelColor="foreground"/> :
                            <ChevronDown size={16}/>}</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="AI"
                        onAction={(key) => {
                            switch (key) {
                                case "Summary":
                                    generateSummary()
                                    break;
                                case "Image":
                                    generateImage()
                                    break;
                                default:
                                    console.log("default")
                                    break;
                            }
                        }
                        }
                    >
                        <DropdownItem key={"Summary"}>Generate Summary</DropdownItem>
                        <DropdownItem key={"Image"}>Generate Image</DropdownItem>
                        {/* <DropdownItem key={modes.QUIZ_MODE}>{modes.QUIZ_MODE}</DropdownItem> */}
                    </DropdownMenu>
                </Dropdown>
                <Input content={searchQuestion} onKeyDown={handleSearchChange} type="search"
                       placeholder="Ask something..."
                       id="clear-border"
                       classNames={{
                           wrapper: "h-10",
                           inputWrapper: "h-10",
                       }}
                ></Input>
                <Button className="gradient-bg flex-shrink" type="button" onClick={saveNote}>Save</Button>
            </div>

            <div className="px-4 pt-4">
                <Image
                    width={10000}
                    height={240}
                    src={config.API_URL + "/static/generated/" + id + ".png"}
                    // fallbackSrc="https://via.placeholder.com/300x200"
                    alt="NextUI Image with fallback"
                    classNames={{
                        wrapper: `w-full max-w-full mt-0 mb-2 ${imageLoaded ? 'block' : 'hidden'}`,
                        img: 'rounded-md w-full object-cover h-60'
                    }}
                    onLoad={() => {
                        setImageLoaded(true)
                    }}
                />
                <input className="bg-transparent outline-none border-none text-4xl font-bold text-gray-800 mt-4 mb-4"
                       onChange={handleTitleChange} value={title}/>
                {/* <div>
              <input type="checkbox" checked={isEditable} onChange={() => setIsEditable(!isEditable)}/>
              Editable
          </div> */}

                {editor && (
                    <BubbleMenu editor={editor} tippyOptions={{duration: 100}}>
                        {!isQuestionGenerationLoading ? (
                            <button
                                onClick={() =>
                                    generateQuestions(window.getSelection().toString())
                                }
                                className="bg-rose-500 hover:bg-rose-700 text-white px-2 py-1 rounded-md shadow"
                            >
                                Generate
                            </button>
                        ) : (
                            <Button color="primary" isLoading>
                                Loading
                            </Button>
                        )}
                    </BubbleMenu>
                )}
                {editor && (
                    <FloatingMenu editor={editor} tippyOptions={{duration: 100}}>
                        <Card className="py-1">
                            <CardBody>
                                <p className="text-xs px-2">MENU</p>
                                <button
                                    onClick={() =>
                                        editor.chain().focus().toggleHeading({level: 1}).run()
                                    }
                                    className={`${
                                        editor.isActive("heading", {level: 1})
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                     text-left px-2 hover:brightness-75
                                    `}
                                >
                                    Heading 1
                                </button>
                                <button
                                    onClick={() =>
                                        editor.chain().focus().toggleHeading({level: 2}).run()
                                    }
                                    className={`${
                                        editor.isActive("heading", {level: 2})
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                        text-left px-2 hover:brightness-75
                                        `}
                                >
                                    Heading 2
                                </button>
                                <button
                                    onClick={() => {
                                        editor.commands.insertContent(
                                            '<question-node question="" answer="">Hello</question-node><br class="ProseMirror-trailingBreak">'
                                        );
                                    }}
                                    className={`${
                                        editor.isActive("questionNode")
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                    text-left px-2 hover:brightness-75
                                    `}
                                >
                                    Question
                                </button>
                                <button
                                    onClick={() => {
                                        onAddImageModalOpen()
                                    }}
                                    className={`${
                                        editor.isActive("questionNode")
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                    text-left px-2 hover:brightness-75
                                    `}
                                >
                                    Image
                                </button>
                                <button
                                    onClick={() =>
                                        editor.chain().focus().toggleBulletList().run()
                                    }
                                    className={`${
                                        editor.isActive("bulletList")
                                            ? "is-active floating-menu-button"
                                            : "floating-menu-button"
                                    }
                                        text-left px-2 hover:brightness-75
                                        `}
                >
                  Bullets
                </button>
              </CardBody>
            </Card>
          </FloatingMenu>
        )}
        {mode === modes.QUIZ_MODE ? (
          <div>
            {editor &&
              getHTMLQns(editor.getHTML()).map((question, index) => (
                <div key={index}>
                  <QuizCard
                    key={index}
                    question={question.getAttribute("question")}
                    expectedAnswer={question.getAttribute("answer")}
                  />
                  <br />
                </div>
              ))}
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      {notification && (
        <Notification message={notification} setMessage={setNotification} />
      )}
    </section>
  );
};
