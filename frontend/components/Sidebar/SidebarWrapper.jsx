import React, {useState, useEffect } from 'react'
import './SidebarWrapper.css'

import { SidebarTab } from './SidebarTab' 
import { Divider } from '@/components/Common/Divider'
import { X, Menu, PlusCircle } from 'lucide-react';

import { Button } from '@nextui-org/button';

import config from "@/config"
import { getNodeTitles } from '@/logic-handling/fetchNode'

export function SidebarWrapper(props) {
    const [tabs, setTabs] = useState([]) // setTabs shd be called on the data fetched frm db
    const [activeTab, setActiveTab] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        try {
            getNodeTitles()
            .then(tabsData => {
                console.log("AAA")
                console.log(tabsData)
                setTabs(tabsData.data)
            })
            if (!titlesRes.ok){
                throw new Error('Error occured when fetching node titles!')
            }
            // const data = await titlesResx.json()
            // console.log(data, 'data!!!')
            
        } catch(e){
            console.error(e.message)
        }
    }, [])
    
    const handleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handlePageOpen = (page, tabIndex) => { // insert logic for displaying diff nodes &/ create new node
        setActiveTab(tabIndex)
    }

    return (
        <>  {sidebarOpen ? 

                <div className={`py-0 px-0 m-0 dark:border-gray-500 border-r sidebarContainer ${sidebarOpen && 'sidebarOpen'}`} onClick={(e)=>{e.stopPropagation()}}>
                    <div className='newPageCloseBtn p-4'>
                        {/* <SidebarTab 
                        onClick={()=>{handlePageOpen('new')}}
                        >
                            New Tab
                        </SidebarTab>   */}
                        <Button
                        // variant='solid'
                        onClick={()=>{handlePageOpen('new')}}
                        className="gradient-bg button border-0"
                        >
                            New Note <PlusCircle size={16}/>
                        </Button>
                        <div className='closeBtnContainer'>
                            <span onClick={handleSidebarOpen}>
                                {/* <img className='svgLogo' src={lucideLogo} alt='Lucide Logo' /> */}
                                <X/>
                            </span>
                        </div>   
                    </div> 
                    <Divider/>
                    <div className="p-4 flex flex-col gap-4">
                    {
                        tabs.map((tab, index) => (
                            <SidebarTab 
                            key={index} 
                            active={activeTab===index}
                            onClick={()=>{handlePageOpen(tab.title, index)}}
                            >
                                {tab.title}
                            </SidebarTab>
                        ))
                    }
                    </div>
                </div>
                :
                <div className={`sidebarContainer ${sidebarOpen && 'sidebarOpen'} ${!sidebarOpen && 'sidebarIcon'}`} onClick={handleSidebarOpen}><Menu size={24} className="editorMenu"/></div>
            }   
        </>
    );
}
 
