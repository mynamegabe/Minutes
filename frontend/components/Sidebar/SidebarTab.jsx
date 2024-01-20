import React, {useState, useEffect } from 'react'
import './SidebarTab.css'
import {Card, Button} from '@nextui-org/react'

export function SidebarTab (props) {
    const {active, children, tabIcon, onClick } = props;

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
        className={`tabContainer w-full rounded-md dark:bg-neutral-950 bg-stone-200 ${active ? 'active' : ''} `}
        onClick={onClick}
        >
            <span className='tabName text-sm text-slate-950 dark:text-white'>
                {children}
            </span>
            <span className='tabIcon text-sm text-slate-950 dark:text-white'>
                {tabIcon}
            </span>
        </Button>
    )
};

 