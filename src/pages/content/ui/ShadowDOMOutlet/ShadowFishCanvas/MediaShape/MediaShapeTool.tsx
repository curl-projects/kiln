import { StateNode, BaseBoxShapeTool, TLStateNodeConstructor } from '@tldraw/editor'
// import { Idle } from './toolStates/Idle'
// import { Pointing } from './toolStates/Pointing'

/** @public */
export class MediaShapeTool extends BaseBoxShapeTool {
	static override id = 'media'
	static override initial = 'idle'
	override shapeType = 'media'
}