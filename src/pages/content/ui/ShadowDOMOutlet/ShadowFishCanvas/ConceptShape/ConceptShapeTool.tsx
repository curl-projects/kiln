import { StateNode, BaseBoxShapeTool, TLStateNodeConstructor } from '@tldraw/editor'
// import { Idle } from './toolStates/Idle'
// import { Pointing } from './toolStates/Pointing'

/** @public */
export class ConceptShapeTool extends BaseBoxShapeTool {
	static override id = 'concept'
	static override initial = 'idle'
	override shapeType = 'concept'
}