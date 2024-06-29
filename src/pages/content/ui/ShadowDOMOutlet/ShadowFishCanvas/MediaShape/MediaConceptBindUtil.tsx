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
} from 'tldraw'

type MediaConceptModelBinding = TLBaseBinding<'mediaConcept', 
    { anchor: VecModel,
      proportionX: number,
      proportionY: number,
    
    }>

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}   

export class MediaConceptBindingUtil extends BindingUtil<MediaConceptModelBinding>{
	static override type = 'mediaConcept' as const

	override getDefaultProps() {
		return {
			anchor: { x: 0, y: 0 },
            proportionX: getRandomNumber(0.2, 0.8),
            proportionY: getRandomNumber(0.2, 0.8),
		}
	}

	// when the shape we're stuck to changes, update the sticker's position
	override onAfterChangeToShape({
		binding,
		shapeAfter,
	}: any): void {
		const concept = this.editor.getShape(binding.fromId)!

		const boundMediaShape: any = this.editor.getShape(binding.toId)!

		this.editor.updateShape({
			id: concept.id,
			type: 'concept',
			x: binding.props.proportionX * boundMediaShape.props.w,
			y: binding.props.proportionY * boundMediaShape.props.h,
		})
	}

	// when the thing we're stuck to is deleted, delete the concept too
	override onBeforeDeleteToShape({ binding }: BindingOnShapeDeleteOptions<MediaConceptModelBinding>): void {
		this.editor.deleteShape(binding.fromId)
	}
}

	