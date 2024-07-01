import {
	SelectionEdge,
	TLShapeId,
	canonicalizeRotation,
	getPointerInfo,
	toDomPrecision,
	useEditor,
	useIsEditing,
	useValue,
} from '@tldraw/editor'
import { useCallback, useEffect, useRef } from 'react'
import { FishLabelInput } from './FishLabelInput'

export const FishHeading = function FrameHeading({
	id,
	name,
	width,
	height,
	viewMode,
    worldModel
}: {
	id: TLShapeId
	name: string
	width: number
	height: number
	viewMode: string
    worldModel: any
}) {
	const editor = useEditor()
	const pageRotation = useValue(
		'shape rotation',
		() => canonicalizeRotation(editor.getShapePageTransform(id)!.rotation()),
		[editor, id]
	)

	const isEditing = useIsEditing(id)

	const rInput = useRef<HTMLInputElement>(null)

	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			const event = getPointerInfo(e)

			// If we're editing the frame label, we shouldn't hijack the pointer event
			if (editor.getEditingShapeId() === id) return

			editor.dispatch({
				type: 'pointer',
				name: 'pointer_down',
				target: 'shape',
				shape: editor.getShape(id)!,
				...event,
			})
			e.preventDefault()
		},
		[editor, id]
	)

	useEffect(() => {
		const el = rInput.current
		if (el && isEditing) {
			// On iOS, we must focus here
			el.focus()
			el.select()
		}
	}, [rInput, isEditing])

	// rotate right 45 deg
	const offsetRotation = pageRotation + Math.PI / 4
	const scaledRotation = (offsetRotation * (2 / Math.PI) + 4) % 4
	const labelSide: SelectionEdge = (['top', 'left', 'bottom', 'right'] as const)[
		Math.floor(scaledRotation)
	]

	let labelTranslate: string
	switch (labelSide) {
		case 'top':
			labelTranslate = ``
			break
		case 'right':
			labelTranslate = `translate(${toDomPrecision(width)}px, 0px) rotate(90deg)`
			break
		case 'bottom':
			labelTranslate = `translate(${toDomPrecision(width)}px, ${toDomPrecision(
				height
			)}px) rotate(180deg)`
			break
		case 'left':
			labelTranslate = `translate(0px, ${toDomPrecision(height)}px) rotate(270deg)`
			break
	}

	return (
		<div
			style={{
				overflow: isEditing ? 'visible' : 'hidden',
				maxWidth: worldModel.props.viewMode !== 'fish' ? `calc(var(--tl-zoom) * ${
					labelSide === 'top' || labelSide === 'bottom' ? Math.ceil(width) : Math.ceil(height)
				}px + var(--space-5))` : 'unset',
				// bottom: '100%',

				// transform: `scale(var(--tl-scale))`,
				// transformOrigin: "top left",
				borderRadius: '6px',
				backgroundColor: "rgba(255, 255, 255, 0.55)",
				border: '1px solid rgba(255, 255, 255, 0.95)',
				paddingBottom: "0px",
				top: '10px',
				left: '10px',
				color: "#9A98A0",
				textTransform: 'uppercase',
				fontWeight: 600,
				fontSize: '12px',
                display: 'flex',
				letterSpacing: "0.03em",
				// paddingRight: minimized ? "0px !important" : "unset",
			}}
			onPointerDown={handlePointerDown}
		>
			<div className="tl-frame-heading-hit-area">
				<FishLabelInput ref={rInput} id={id} name={name} isEditing={isEditing} />
			</div>
			{['fish', 'minimized'].includes(viewMode) &&
                <div style={{
                    display: 'flex',
                    gap: "6px",
                }}>
				<div style={{
					borderRadius: '100%',
					margin: 0,
					height: '18px',
					width: '20px',
					// backgroundColor: "rgba(99, 99, 94, 0.5)",
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
				}}>
					<p 
                    className='kiln-fish-full-button'
                    onPointerDown={()=>{

                        const worldModelBinding = editor.getBindingsToShape(worldModel.id, 'fishWorldModel')[0]
                        const fish = editor.getShape(worldModelBinding.fromId)
                        let [x, y] = [fish.x, fish.y]

                        // reparent world model and place on page
                        editor.reparentShapes([worldModelBinding.toId], editor.getCurrentPageId())

                        editor.updateShape({
                            id: worldModel.id,
                            type: 'worldModel',
                            isLocked: false,
                            opacity: 1,
                            x: x - 10,
                            y: y - 10,
                            props: {
                                viewMode: 'full'
                            }
                        })

                        // reparent fish and place on world model
                        editor.reparentShapes([worldModelBinding.fromId], worldModelBinding.toId)

                        editor.updateShape({
                            id: worldModelBinding.fromId,
                            type: 'fish',
                            x: 10,
                            y: 10,
                        })

                        
                    }}
                    style={{
						margin: "0px", 
						cursor: "pointer",
						color: "rgb(0, 0, 0)",
                        border: "2px solid black",
                        height: "20px",
                        width: '20px',
					}}>+</p>
				</div>
                </div>
                
			}
			
		</div>
	)
}