import {
	Editor,
	StateNode,
	TLEventHandlers,
	TLInterruptEvent,
	TLNoteShape,
	TLPointerEventInfo,
	TLShapeId,
	Vec,
	createShapeId,
} from '@tldraw/editor'
import { NOTE_PIT_RADIUS, getAvailableNoteAdjacentPositions } from '../noteHelpers'

export class Pointing extends StateNode {
	static override id = 'pointing'

	dragged = false

	info = {} as TLPointerEventInfo

	wasFocusedOnEnter = false

	markId = ''

	shape = {} as TLNoteShape

	override onEnter = () => {
		const { editor } = this

		this.wasFocusedOnEnter = !editor.getIsMenuOpen()

		if (this.wasFocusedOnEnter) {
			const id = createShapeId()
			this.markId = `creating:${id}`
			editor.mark(this.markId)

			// Check for note pits; if the pointer is close to one, place the note centered on the pit
			const center = this.editor.inputs.originPagePoint.clone()
			const offset = getNotePitOffset(this.editor, center)
			if (offset) {
				center.sub(offset)
			}
			this.shape = createSticky(this.editor, id, center)
		}
	}

	override onPointerMove: TLEventHandlers['onPointerMove'] = (info) => {
		if (this.editor.inputs.isDragging) {
			if (!this.wasFocusedOnEnter) {
				const id = createShapeId()
				const center = this.editor.inputs.originPagePoint.clone()
				const offset = getNotePitOffset(this.editor, center)
				if (offset) {
					center.sub(offset)
				}
				this.shape = createSticky(this.editor, id, center)
			}

			this.editor.setCurrentTool('select.translating', {
				...info,
				target: 'shape',
				shape: this.shape,
				onInteractionEnd: 'note',
				isCreating: true,
				onCreate: () => {
					this.editor.setEditingShape(this.shape.id)
					this.editor.setCurrentTool('select.editing_shape')
				},
			})
		}
	}

	override onPointerUp: TLEventHandlers['onPointerUp'] = () => {
		this.complete()
	}

	override onInterrupt: TLInterruptEvent = () => {
		this.cancel()
	}

	override onComplete: TLEventHandlers['onComplete'] = () => {
		this.complete()
	}

	override onCancel: TLEventHandlers['onCancel'] = () => {
		this.cancel()
	}

	private complete() {
		if (this.wasFocusedOnEnter) {
			if (this.editor.getInstanceState().isToolLocked) {
				this.parent.transition('idle')
			} else {
				this.editor.setEditingShape(this.shape.id)
				this.editor.setCurrentTool('select.editing_shape', {
					...this.info,
					target: 'shape',
					shape: this.shape,
				})
			}
		}
	}

	private cancel() {
		this.editor.bailToMark(this.markId)
		this.parent.transition('idle', this.info)
	}
}

export function getNotePitOffset(editor: Editor, center: Vec) {
	let min = NOTE_PIT_RADIUS / editor.getZoomLevel() // in screen space
	let offset: Vec | undefined
	for (const pit of getAvailableNoteAdjacentPositions(editor, 0, 0)) {
		// only check page rotations of zero
		const deltaToPit = Vec.Sub(center, pit)
		const dist = deltaToPit.len()
		if (dist < min) {
			min = dist
			offset = deltaToPit
		}
	}
	return offset
}

export function createSticky(editor: Editor, id: TLShapeId, center: Vec) {
	editor
		.createShape({
			id,
			type: 'note',
			x: center.x,
			y: center.y,
		})
		.select(id)

	const shape = editor.getShape<TLNoteShape>(id)!
	const bounds = editor.getShapeGeometry(shape).bounds

	// Center the text around the created point
	editor.updateShapes([
		{
			id,
			type: 'note',
			x: shape.x - bounds.width / 2,
			y: shape.y - bounds.height / 2,
		},
	])

	return editor.getShape<TLNoteShape>(id)!
}
