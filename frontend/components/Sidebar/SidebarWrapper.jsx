import React, { useState, useEffect } from "react";
import "./SidebarWrapper.css";

import { SidebarTab } from "./SidebarTab";
import { Divider } from "@/components/Common/Divider";
import { X, Menu, PlusCircle } from "lucide-react";

import config from "@/config"
import { getNodeTitles } from '@/logic-handling/fetchNode'
import { getNodeById } from '@/logic-handling/fetchNodeById'


import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

export function SidebarWrapper(props) {
  const {activeTab, setActiveTab, activeTabData, setActiveTabData, nodeData, setNodeData } = props;

  const [tabs, setTabs] = useState([]); // setTabs shd be called on the data fetched frm db
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");

    useEffect(() => {
        try {
            getNodeTitles()
            .then(tabsData => {
                console.log("AAA")
                console.log(tabsData)
                setTabs(tabsData.data)
            })
            // const data = await titlesResx.json()
            // console.log(data, 'data!!!')
            
        } catch(e){
            console.error(e.message)
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getNodeById(tabs[activeTab].id);
                console.log(data, 'lolll');
                if (!data.status === "success") {
                    throw new Error('Error occurred when fetching node by ID!');
                }
                setNodeData(data);
                setActiveTabData(data.data)
            } catch (e) {
                console.error(e.message);
            }
        };
    
        fetchData();
    }, [activeTab]);
    
    const handleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handlePageOpen = (page, tabIndex) => { // insert logic for displaying diff nodes &/ create new node
        setActiveTab(tabIndex)
    }

  const createNewNote = async () => {
    const body = {
      title: title,
      content: [],
    };

    const res = await fetch(`${config.API_URL}/api/notes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        const { title, id } = data.data;
        const newObj = { title, id };
        setTabs(tabs => [newObj, ...tabs]);      
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New Note
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Title"
                  placeholder=""
                  onChange={(event) => setTitle(event.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "border-0 outline-none focus:outline-none shadow-none focus:shadow-none border-none focus:border-none ",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={createNewNote}>
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {sidebarOpen ? (
        <div
          className={`py-0 px-0 m-0 sticky top-16 dark:border-gray-500 border-r sidebarContainer ${
            sidebarOpen && "sidebarOpen"
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="newPageCloseBtn p-4">
            {/* <SidebarTab 
                        onClick={()=>{handlePageOpen('new')}}
                        >
                            New Tab
                        </SidebarTab>   */}
            <Button
              // variant='solid'
              onClick={onOpen}
              className="gradient-bg button border-0"
            >
              New Note <PlusCircle size={16} />
            </Button>
            <div className="closeBtnContainer">
              <span onClick={handleSidebarOpen}>
                {/* <img className='svgLogo' src={lucideLogo} alt='Lucide Logo' /> */}
                <X />
              </span>
            </div>
          </div>
          <Divider />
          <div className="p-4 flex flex-col gap-4">
            {tabs.map((tab, index) => (
              <SidebarTab
                key={index}
                active={activeTab === index}
                onClick={() => {
                  handlePageOpen(tab.title, index);
                }}
              >
                {tab.title}
              </SidebarTab>
            ))}
          </div>
        </div>
      ) : (
        <div
          className={`sidebarContainer p-4 ${sidebarOpen && "sidebarOpen"} ${
            !sidebarOpen && "sidebarIcon"
          }`}
          onClick={handleSidebarOpen}
        >
          <Menu size={24} className="editorMenu" />
        </div>
      )}
    </>
  );
}
