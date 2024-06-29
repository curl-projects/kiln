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

type KinematicCanvasModelBinding = TLBaseBinding<'kinematicCanvas', { anchor: VecModel }>

export class KinematicCanvasBindingUtil extends BindingUtil<KinematicCanvasModelBinding>{
	static override type = 'kinematicCanvas' as const

	override getDefaultProps() {
		return {
			anchor: { x: 0, y: 0 },
		}
	}

	// when the shape we're stuck to changes, update the sticker's position
	override onAfterChangeToShape({
		binding,
		shapeAfter,
	}: any): void {
		const kinematicCanvas = this.editor.getShape(binding.fromId)!

		const boundShape: any = this.editor.getShape(binding.toId)!

		this.editor.updateShape({
			id: kinematicCanvas.id,
			type: 'kinematicCanvas',
			x: boundShape.props.w+80,
			y: 0,
			props: {
				w: 400,
				h: boundShape.props.h,
			}
		})
	}

	// when the thing we're stuck to is deleted, delete the sticker too
	override onBeforeDeleteToShape({ binding }: BindingOnShapeDeleteOptions<KinematicCanvasModelBinding>): void {
		this.editor.deleteShape(binding.fromId)
	}
}

	

	
//     static override type 'worldModel' as const

//     override getDefaultProps() {
// 		return {
// 			anchor: { x: 0.5, y: 0.5 },
// 		}
// 	}

// 	// when the shape we're stuck to changes, update the sticker's position
// 	override onAfterChangeToShape({
// 		binding,
// 		shapeAfter,
// 	}: BindingOnShapeChangeOptions<StickerBinding>): void {
// 		const sticker = this.editor.getShape<StickerShape>(binding.fromId)!

// 		const shapeBounds = this.editor.getShapeGeometry(shapeAfter)!.bounds
// 		const shapeAnchor = {
// 			x: lerp(shapeBounds.minX, shapeBounds.maxX, binding.props.anchor.x),
// 			y: lerp(shapeBounds.minY, shapeBounds.maxY, binding.props.anchor.y),
// 		}
// 		const pageAnchor = this.editor.getShapePageTransform(shapeAfter).applyToPoint(shapeAnchor)

// 		const stickerParentAnchor = this.editor
// 			.getShapeParentTransform(sticker)
// 			.invert()
// 			.applyToPoint(pageAnchor)

// 		this.editor.updateShape({
// 			id: sticker.id,
// 			type: 'sticker',
// 			x: stickerParentAnchor.x,
// 			y: stickerParentAnchor.y,
// 		})

// }