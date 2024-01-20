"use client";

import { title } from "@/components/primitives";
import "@/styles/globals.css";
import { Editor } from "@/components/editor";

import { SidebarWrapper } from '@/components/Sidebar/SidebarWrapper'

export default function EditorPage() {
	return (
		<>
			<SidebarWrapper/>
			<Editor/>
		</>
	);
}
