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

const CustomToolbar = track(() => {
	const editor = useEditor()
	const tools = useTools()

	return (
		<div style={styles.customLayout}>
			<div style={styles.customToolbar}>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('select')} 
					name='select (V)'
					active={editor.getCurrentToolId() === 'select'}>
					<PiCursorFill />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('draw')} 
					name='draw (D)'
					active={editor.getCurrentToolId() === 'draw'}>
					<PiPencilSimpleFill />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('eraser')} 
					name='erase (E)'
					active={editor.getCurrentToolId() === 'eraser'}>
					<BiSolidEraser />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('worldModel')} 
					name='world model (W)'
					active={editor.getCurrentToolId() === 'worldModel'}>
					<TbGlobe />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('media')} 
					name='media (M)'
					active={editor.getCurrentToolId() === 'media'}>
					<TbLibrary />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('concept')} 
					name='concept (C)'
					active={editor.getCurrentToolId() === 'concept'}>
					<TbRegex />
				</ToolbarButton>
			</div>
		</div>
	)
})

export default CustomToolbar

const styles = {
	customLayout: {
	  position: 'absolute',
	  inset: 0,
	  zIndex: 300,
	  pointerEvents: 'none',
	},
	customToolbar: {
	  position: 'absolute',
	  bottom: 0,
	  left: 0,
	  width: '100%',
	  display: 'flex',
	  alignItems: 'center',
	  justifyContent: 'center',
	  padding: '20px',
	  gap: '8px',
	},
};



function ToolbarButton({ children, handleClick, active, name }){
	const [hovered, setHovered] = useState(false)
	return(
		<div 
			className='tl-kiln-toolbar-controls'
			style={{backgroundColor: active ? 'rgba(211, 211, 211, 1)' : "rgba(233, 232, 230, 0.95)"}} 
			onPointerDown={handleClick}
			onMouseEnter={()=>setHovered(true)}
			onMouseLeave={()=>setHovered(false)}
			>
			{children}
			{hovered &&
				<div style={{
					position: "absolute",
					bottom: "100%",
					marginBottom: '10px',
					width: 'fit-content',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					textWrap: 'nowrap ',
					whiteSpace: 'nowrap ',
					backgroundColor: "#F9F9F8",
					border: "2px solid #D2D1CD",
					borderRadius: "12px",
					padding: "8px",
					boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
				}}>
					<p style={{
						fontWeight: 600,
						fontSize: '8px',
						color: "#63635E",
						display: "flex",
						textWrap: 'nowrap',
						whiteSpace: 'nowrap',
						alignItems: 'center',
						margin: 0,
						fontFamily: 'monospace',
					}}>{name}</p>
				</div>
			}
		</div>
	)
}