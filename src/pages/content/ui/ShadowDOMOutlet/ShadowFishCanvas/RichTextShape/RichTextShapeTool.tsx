import { StateNode } from '@tldraw/editor'
import { Idle } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/text/toolStates/Idle'
import { Pointing } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/text/toolStates/Pointing'

/** @public */
export class RichTextShapeTool extends StateNode {
	static override id = 'tiptap'
	static override initial = 'idle'
	static override children = () => [Idle, Pointing]
	override shapeType = 'tiptap'
}

