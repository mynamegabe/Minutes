import React, {useState, useEffect } from 'react'
import './SidebarTab.css'
import {Card, Button, Spinner} from '@nextui-org/react'
import { Check, Trash, X } from 'lucide-react';

import { deleteNodeById } from '@/logic-handling/deleteNodebyId'

export function SidebarTab (props) {
    const {active, children, tabIcon, onClick, tabId, setTabs } = props;
    console.log(tabId, 'IDIDIID')

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteTab = async (e, tabId) => {
        e.stopPropagation()
        console.log(tabId, 'tabid')
        console.log('running deletion')
        setIsLoading(true)
        console.log('isLoading', isLoading)
        try {
            await deleteNodeById(tabId)
            setTabs(currentTabs => currentTabs.filter(
                    tab => tab.id !== tabId
                )
            )
            console.log('tab deleted!')

        } catch (e) {
            console.error(e.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        // <div className={`tabContainer ${active ? 'active' : ''} `} onClick={onClick}>
        //     <span className='tabName'>
        //         {children}
        //     </span>
        //     <span className='tabIcon'>
        //         {tabIcon}
        //     </span>
        // </div>
        <Button
        variant='solid'
        className={`tabContainer justify-center w-full rounded-md dark:bg-neutral-950 bg-stone-200 ${active && 'active'} `}
        onClick={onClick}
        onMouseEnter={()=>{setIsHovered(true)}} 
        onMouseLeave={()=>{setIsHovered(false)}}
        >
            <span className={`tabName text-left text-sm text-slate-950 dark:text-white ${active && "text-white" }`}>
                {children} 
            </span>
            {
                isHovered && !isLoading &&
                <span className='deleteIcon text-left text-sm text-slate-950 dark:text-white' onClick={(e) => handleDeleteTab(e, tabId)}>
                    <Trash size={16} fill="#d56262" onClick={()=>{console.log("DATA")}}/>
                </span>
            }
            {
                isLoading && <Spinner color="default" size="sm"/>
            }
        </Button>
    )
};

 