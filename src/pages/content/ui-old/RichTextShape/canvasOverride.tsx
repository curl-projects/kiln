
import { createShapeId, TLClickEventInfo, TLTextShape } from '@tldraw/editor';

export function handleDoubleClickOnCanvas(info: TLClickEventInfo) {
	// Create text shape and transition to editing_shape
	if (this.editor.getInstanceState().isReadonly) return

	this.editor.mark('creating media text shape')
	const id = createShapeId()
	const { x, y } = this.editor.inputs.currentPagePoint
	this.editor
			.createShapes([
				{
					id,
					type: 'media',
					x,
					y,
					props: {
						text: JSON.stringify("Untitled"),
					},
				},
			])
			.select(id)
	
	this.editor.setEditingShape(id)
	
	this.editor.root.getCurrent()?.transition('editing_shape')
	
	this.editor.setCurrentTool('select')
}

