"use client";
import React, {useState } from 'react'
import { title } from "@/components/primitives";
import "@/styles/globals.css";
import { Editor } from "@/components/Editor";

import { SidebarWrapper } from '@/components/Sidebar/SidebarWrapper'

export default function EditorPage() {
	const [activeTab, setActiveTab] = useState(0)
	const [activeTabData, setActiveTabData] = useState({})
    const [nodeData, setNodeData] = useState('')
	return (
		<>
			<SidebarWrapper 
			activeTab={activeTab} 
			setActiveTab={setActiveTab}
			activeTabData={activeTabData}
			setActiveTabData={setActiveTabData}
			nodeData={nodeData}
			setNodeData={setNodeData}
			/>
			{activeTabData && activeTabData.id && <Editor key={activeTabData?.id || ""} data={activeTabData} setData={setActiveTabData}/>}
		</>
	);
}
