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
import { useEffect } from 'react'
import { PiCursorFill } from "react-icons/pi";
import { PiPencilSimpleFill } from "react-icons/pi";
import { PiTextTBold } from "react-icons/pi";
import { BiSolidEraser } from "react-icons/bi";

const CustomToolbar = track(() => {
	const editor = useEditor()
	const tools = useTools()

	return (
		<div style={styles.customLayout}>
			<div style={styles.customToolbar}>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('select')} 
					active={editor.getCurrentToolId() === 'select'}>
					<PiCursorFill />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('draw')} 
					active={editor.getCurrentToolId() === 'draw'}>
					<PiPencilSimpleFill />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('tiptap')} 
					active={editor.getCurrentToolId() === 'tiptap'}>
					<PiTextTBold />
				</ToolbarButton>
				<ToolbarButton 
					handleClick={() => editor.setCurrentTool('eraser')} 
					active={editor.getCurrentToolId() === 'eraser'}>
					<BiSolidEraser />
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



function ToolbarButton({ children, handleClick, active }){
	return(
		<div 
			style={{...buttonStyles.buttonWrapper, borderColor: active ? '#FEAC85' : 'inherit'}} 
			onClick={handleClick}>
			<p style={{...buttonStyles.buttonText, color: active ? '#FEAC85' : 'inherit'}}>{children}</p>
		</div>
	)
}

const buttonStyles = {
	buttonWrapper: {
		border: '3px solid #7F847D',
		borderRadius: '50%',
		width: '40px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '40px',
		pointerEvents: 'all',
		cursor: 'pointer',
	},
	buttonText: {
		fontSize: '24px',
		color: "#7F847D",
		margin: 0,
		position: 'relative',
		top: '2px',
		}
}



// function ToolbarWrapper({ children }){
// 	return(
// 		<div className={toolbarStyles.toolbarWrapper}>
// 			<div className={toolbarStyles.toolbarInnerWrapper}>
// 				<div className={toolbarStyles.tools}>
// 					{children}
// 				</div>
// 			</div>
// 		</div>
// 	)
// }


// const toolbarStyles = {
// 	toolbarWrapper: {
// 		display: 'flex',
// 		alignItems: 'center',
// 		justifyContent: 'center',
// 		flexGrow: 2,
// 		paddingBottom: 'calc(var(--space-3) + var(--sab))',
// 		position: 'absolute',
// 		bottom: 0,
// 		left: 0,
// 		width: '100%',
// 	},
// 	toolbarInnerWrapper: {
// 		position: 'relative',
// 		width: 'fit-content',
// 		display: 'flex',
// 		gap: 'var(--space-3)',
// 		alignItems: 'flex-end',
// 	},
// 	tools: {
// 		display: 'flex',
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		backgroundColor: 'var(--color-low)',
// 		borderRadius: 'var(--radius-4)',
// 		zIndex: 'var(--layer-panels)',
// 		pointerEvents: 'all',
// 		position: 'relative',
// 		background: 'var(--color-panel)',
// 		boxShadow: 'var(--shadow-2)'
// 	}
// }





// // export default CustomToolbar

// export default function CustomToolbar() {
// 	const editor = useEditor()
// 	const tools = useTools()
//     const isContentSelected = useIsToolSelected(tools['content'])

// 	return (
// 			<ToolbarWrapper>
// 				{/* <TldrawUiMenuItem {...tools['content']} isSelected={isContentSelected} /> */}

// 				{/* <DefaultToolbarContent /> */}
// 				<button
// 					onClick={() => {
// 						editor.selectAll().deleteShapes(editor.getSelectedShapeIds())
// 					}}
// 					title="delete all"
// 				>
// 					🧨
// 				</button>
// 				<ToolbarButton 
// 					handleClick={() => editor.setCurrentTool('select')} 
// 					active={editor.getCurrentToolId() === 'select'}>
// 					<PiCursorFill />
// 				</ToolbarButton>
// 				<ToolbarButton 
// 					handleClick={() => editor.setCurrentTool('draw')} 
// 					active={editor.getCurrentToolId() === 'draw'}>
// 					<PiPencilSimpleFill />
// 				</ToolbarButton>
// 				<ToolbarButton 
// 					handleClick={() => editor.setCurrentTool('content')} 
// 					active={editor.getCurrentToolId() === 'content'}>
// 					<PiTextTBold />
// 				</ToolbarButton>
// 				<ToolbarButton 
// 					handleClick={() => editor.setCurrentTool('text')} 
// 					active={editor.getCurrentToolId() === 'text'}>
// 					T
// 				</ToolbarButton>
// 				<ToolbarButton 
// 					handleClick={() => editor.setCurrentTool('eraser')} 
// 					active={editor.getCurrentToolId() === 'eraser'}>
// 					<BiSolidEraser />
// 				</ToolbarButton>
// 			</ToolbarWrapper>
// 	)
// }

