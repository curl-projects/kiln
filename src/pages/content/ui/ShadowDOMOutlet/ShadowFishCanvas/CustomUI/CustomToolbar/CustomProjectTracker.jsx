import {
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultToolbar,
	DefaultToolbarContent,
	Tldraw,
	TldrawUiMenuItem,
    StateNode,
    useEditor,
	useIsToolSelected,
	useTools,
	track
} from 'tldraw'
import { useEffect, useState, } from 'react'
import { PiCursorFill } from "react-icons/pi";
import { PiPencilSimpleFill } from "react-icons/pi";
import { PiTextTBold } from "react-icons/pi";
import { BiSolidEraser } from "react-icons/bi";
import { TbGlobe } from "react-icons/tb";
import { TbLibrary } from "react-icons/tb";
import { TbRegex } from "react-icons/tb";

export const CustomProjectTracker = track(() => {
	const editor = useEditor()

	return (
		<div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            border: '2px solid black',
            height: '200px',
            width: '200px'
        }}>

		</div>
	)
})