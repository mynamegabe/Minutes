import React, {useState, useEffect } from 'react'
import './SidebarWrapper.css'

import { SidebarTab } from './SidebarTab' 
import { Divider } from '../Common/Divider'
import lucideLogo from '../../../public/Lucide_logo.svg'

import { getNodeTitles } from '../../logic-handling/fetchNode'

export function SidebarWrapper(props) {
    const [tabs, setTabs] = useState(['a', 'b', 'c']) // setTabs shd be called on the data fetched frm db
    const [activeTab, setActiveTab] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(async () => {
        try{
            const titlesRes = await getNodeTitles();
            if (!titlesRes.ok){
                throw new Error('Error occured when fetching node titles!')
            }
            const data = await titlesRes.json()
            console.log(data, 'data!!!')
            
        } catch(e){
            console.error(e.message)
        }
    }, [tabs, sidebarOpen])
    
    const handleSidebarOpen = () => {
        setSidebarOpen(!sidebarOpen)
    }
    const closeFromOutside = () => {
        if (sidebarOpen){
            setSidebarOpen(false)
        }
    }

    const handlePageOpen = (page, tabIndex) => { // insert logic for displaying diff nodes &/ create new node
        setActiveTab(tabIndex)
    }

    return (
        <React.Fragment>
            <div className='sidebarModal' onClick={closeFromOutside} >
                <div onClick={handleSidebarOpen}>hell</div> { /*to be removed ltr*/ }
                <div className={`sidebarContainer ${sidebarOpen && 'sidebarOpen'}`} onClick={(e)=>{e.stopPropagation()}}>
                    <div className='newPageCloseBtn'>
                        <SidebarTab 
                        onClick={()=>{handlePageOpen('new')}}
                        >
                            New Tab
                        </SidebarTab>  
                        <div className='closeBtnContainer'>
                            <span onClick={handleSidebarOpen}>
                                <img className='svgLogo' src={lucideLogo} alt='Lucide Logo' />
                            </span>
                        </div>   
                    </div> 
                    <Divider/>
                    {
                        tabs.map((tab, index) => (
                            <SidebarTab 
                            key={index} 
                            active={activeTab===index}
                            onClick={()=>{handlePageOpen(tab, index)}}
                            >
                                {tab}
                            </SidebarTab>
                        ))
                    }
                </div>
            </div>
        </React.Fragment>
    );
}
 
