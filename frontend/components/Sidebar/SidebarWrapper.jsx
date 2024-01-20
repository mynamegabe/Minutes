import React, {useState, useEffect } from 'react'
import './SidebarWrapper.css'

import { SidebarTab } from './SidebarTab' 
import { Divider } from '../Common/Divider'
import lucideLogo from '../../../public/Lucide_logo.svg'


export function SidebarWrapper(props) {
    const [tabs, setTabs] = useState(['a', 'b', 'c'])
    const [activeTab, setActiveTab] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    
    const handleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handlePageOpen = (page) => { // insert logic for displaying diff nodes / create new node
        console.log(page)  
    }

    return (
        <React.Fragment>
            <div onClick={handleSidebarOpen}>hell</div>
            <div className={`sidebarContainer ${sidebarOpen && 'sidebarOpen'}`}>
                <div className='closeBtnContainer'>
                    <span onClick={handleSidebarOpen}>
                        <img className='svgLogo' src={lucideLogo} alt='Lucide Logo' />
                    </span>
                </div>
                <SidebarTab onClick={()=>{handlePageOpen('new')}}>
                    New Tab
                </SidebarTab>       
                <Divider/>
                {
                    tabs.map((tab, index) => (
                        <SidebarTab 
                        key={index} 
                        active={activeTab===index}
                        onClick={()=>{handlePageOpen(tab)}}
                        >
                            {tab}
                        </SidebarTab>
                    ))
                }
            </div>
        </React.Fragment>
    );
}
 
