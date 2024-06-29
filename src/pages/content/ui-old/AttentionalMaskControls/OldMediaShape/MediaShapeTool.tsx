import { StateNode } from '@tldraw/editor'
import { Idle } from './Idle'
import { Pointing } from './Pointing'

/** @public */
export class MediaShapeTool extends StateNode {
	static override id = 'media'
	static override initial = 'idle'
	static override children = () => [Idle, Pointing]
	override shapeType = 'media'
}

