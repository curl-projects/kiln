import { StateNode } from '@tldraw/editor'
import { Idle } from './Idle'
import { Pointing } from './Pointing'

/** @public */
export class TipTapShapeTool extends StateNode {
	static override id = 'tiptap'
	static override initial = 'idle'
	static override children = () => [Idle, Pointing]
	override shapeType = 'tiptap'
}

