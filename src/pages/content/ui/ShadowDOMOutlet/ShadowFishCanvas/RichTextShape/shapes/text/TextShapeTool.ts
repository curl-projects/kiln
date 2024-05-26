import { StateNode } from '@tldraw/editor'
import { Idle } from './toolStates/Idle'
import { Pointing } from './toolStates/Pointing'

/** @public */
export class RichTextShapeTool extends StateNode {
	static override id = 'richText'
	static override initial = 'idle'
	static override children = () => [Idle, Pointing]
	override shapeType = 'richText'
}
