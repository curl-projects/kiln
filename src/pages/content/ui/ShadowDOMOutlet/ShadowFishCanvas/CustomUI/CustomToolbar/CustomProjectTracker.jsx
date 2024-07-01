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
import { Fade } from "react-awesome-reveal";

export const CustomProjectTracker = (props) => {
	const editor = useEditor()
    const [hovered, setHovered] = useState(false)

    // useEffect(()=>{
    //     console.log("EDITOR:", editor.getCurrentPageShapes().filter(shape => shape.type === 'worldModel'))
    // }, [editor.getCurrentPageShapes()])


	return (
		<div 
        onMouseEnter={()=>{setHovered(true)}}
        onMouseLeave={()=>{setHovered(false)}}
        style={{
            position: 'fixed',
            top: 0,
            right: 0,
            zIndex: 10000,
            marginRight: '10px',
            marginTop: '10px',
            pointerEvents: 'all',
            height: 'fit-content',
            width: '250px',
            gap: '8px',
            padding: '10px',
            border: "2px solid #D2D1CD",
			borderRadius: "12px",
            opacity: hovered ? 1 : 0.4,
            transition: 'all 0.3s ease-in-out',
            boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
            backgroundColor: "#F9F9F8",
        }}>
            <p style={{
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                color: "#BBAACC",
                fontWeight: 700,
                textTransform: 'uppercase',
                margin: 0,
            }}>
                BetaWorks Application
            </p>
            <p style={{
                fontSize: '12px',
                lineHeight: '14px',
                color: "#9A98A0",
                fontWeight: 450,
                margin: 0,
            }}>
                Completing and submitting an application to the BetaWorks incubator for Kiln, as a way to kickstart the startup
            </p>
            {/* world model list */}
            <Fade cascade style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '500px',
                overflow: "scroll",
                }}>
                {hovered && editor && editor.getCurrentPageShapes().filter(shape => shape.type === 'worldModel').map((el, idx) => 
                    <div 
                        onClick={()=>{
                            const pageBounds = editor.getShapePageBounds({id: el.id, type: el.type})
                            console.log("PAGE BOUNDS", pageBounds)
                            editor.zoomToBounds(pageBounds, {
                                animation: {
                                    duration: 500,
                                    easing: (t) => t*t,
                                }
                            })
                        }}
                        key={idx} 
                        className='kiln-project-panel-world-model'>
                        <p>{el.props.name}</p>
                    </div>
                )  
                }
            </Fade>

		</div>
	)
}