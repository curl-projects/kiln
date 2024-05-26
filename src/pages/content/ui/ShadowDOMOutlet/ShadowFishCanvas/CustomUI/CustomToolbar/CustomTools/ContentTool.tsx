import { TextShapeTool, StateNode } from 'tldraw'

export class ContentTool extends StateNode {
	static override id = 'content'

	// [a]
	override onEnter = () => {
		this.editor.setCursor({ type: 'cross', rotation: 0 })
	}

	// [b]
	override onPointerDown = () => {
		const { currentPagePoint } = this.editor.inputs
		this.editor.createShape({
			type: 'richText',
			x: currentPagePoint.x,
			y: currentPagePoint.y,
			props: { content: "", contentType: 'paragraph' },
		})
	}
}