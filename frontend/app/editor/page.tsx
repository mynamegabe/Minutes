"use client";
import React, {useState } from 'react'
import { title } from "@/components/primitives";
import "@/styles/globals.css";
import { Editor } from "@/components/editor";

import { SidebarWrapper } from '@/components/Sidebar/SidebarWrapper'

export default function EditorPage() {
	const [activeTab, setActiveTab] = useState(0)
    const [nodeData, setNodeData] = useState('')
	return (
		<>
			<SidebarWrapper 
			activeTab={activeTab} 
			setActiveTab={setActiveTab}
			nodeData={nodeData}
			setNodeData={setNodeData}
			/>
			<Editor activeTab={activeTab}/>
		</>
	);
}
