import React, {useState, useEffect } from 'react'
import './SidebarTab.css'

export function SidebarTab (props) {
    const {active, children, tabIcon, onClick } = props;

    return (
        <div className={`tabContainer ${active ? 'active' : ''} `} onClick={onClick}>
            <span className='tabName'>
                {children}
            </span>
            <span className='tabIcon'>
                {tabIcon}
            </span>
        </div>
    )
};

 