import { TLFrameShape, TLShapeId, stopEventPropagation, useEditor } from '@tldraw/editor'
import { forwardRef, useCallback } from 'react'
import { defaultEmptyAs } from './WorldModelShapeUtil'

export const WorldModelLabelInput = forwardRef<
	HTMLInputElement,
	{ id: TLShapeId; name: string; isEditing: boolean }
>(({ id, name, isEditing }, ref) => {
	const editor = useEditor()

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
				// need to prevent the enter keydown making it's way up to the Idle state
				// and sending us back into edit mode
				stopEventPropagation(e)
				e.currentTarget.blur()
				editor.setEditingShape(null)
			}
		},
		[editor]
	)

	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement>) => {
			const shape = editor.getShape<TLFrameShape>(id)
			if (!shape) return

			const name = shape.props.name
			const value = e.currentTarget.value.trim()
			if (name === value) return

			editor.updateShapes([
				{
					id,
					type: 'worldModel',
					props: { name: value },
				},
			])
		},
		[id, editor]
	)

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const shape = editor.getShape<TLFrameShape>(id)
			if (!shape) return

			const name = shape.props.name
			const value = e.currentTarget.value
			if (name === value) return

			editor.updateShapes([
				{
					id,
					type: 'worldModel',
					props: { name: value },
				},
			])
		},
		[id, editor]
	)

	return (
		<div className={`tl-frame-label ${isEditing ? 'tl-frame-label__editing' : ''}`}>
			<input
				className="tl-frame-name-input"
				ref={ref}
				style={{ 
					display: isEditing ? undefined : 'none',
					color: "#9A98A0",
					textTransform: 'uppercase',
					fontWeight: 600,
					fontSize: '12px',
					letterSpacing: "0.03em",
				}}
				value={name}
				autoFocus
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				onChange={handleChange}
			/>
			{defaultEmptyAs(name, 'World Model') + String.fromCharCode(8203)}
		</div>
	)
})