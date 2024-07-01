import {
	BindingOnShapeChangeOptions,
	BindingOnShapeDeleteOptions,
	BindingUtil,
	Box,
	DefaultToolbar,
	DefaultToolbarContent,
	RecordProps,
	Rectangle2d,
	ShapeUtil,
	StateNode,
	TLBaseBinding,
	TLBaseShape,
	TLEventHandlers,
	TLOnTranslateEndHandler,
	TLOnTranslateStartHandler,
	TLUiComponents,
	TLUiOverrides,
	Tldraw,
	TldrawUiMenuItem,
	VecModel,
	createShapeId,
	invLerp,
	lerp,
	useIsToolSelected,
	useTools,
    BindingOnCreateOptions,
} from 'tldraw'

type FishWorldModelBinding = TLBaseBinding<'fishWorldModel', { 
    scale: number,
}>

export class FishWorldModelBindingUtil extends BindingUtil<FishWorldModelBinding>{
	static override type = 'fishWorldModel' as const

	override getDefaultProps() {
		return {
			scale: 1,
		}
	}

    override onAfterChangeFromShape({binding}) {
        const fish = this.editor.getShape(binding.fromId)!

		const worldModel: any = this.editor.getShape(binding.toId)!

        
        
        // this.editor.updateShape({
        //     id: worldModel.id,
        //     type: 'worldModel',
        //     x: worldModel.x + fish.x - 10,
        //     y: worldModel.y + fish.y - 10
        // })
    }

	// when the shape we're stuck to changes, update the sticker's position
	override onAfterChangeToShape({
		binding,
		shapeAfter,
	}: any): void {
        console.log("HI!")
		const fish = this.editor.getShape(binding.fromId)!

		const worldModel: any = this.editor.getShape(binding.toId)!

		this.editor.updateShape({
			id: fish.id,
			type: 'fish',
			x: 10,
			y: 10,
			props: {
				currentAngle: 0,
			}
		})
	}

	// when the thing we're stuck to is deleted, delete the sticker too
	override onBeforeDeleteToShape({ binding }: BindingOnShapeDeleteOptions<FishWorldModelBinding>): void {
		this.editor.deleteShape(binding.fromId)
	}
}