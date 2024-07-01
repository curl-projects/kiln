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

type FeedModelBinding = TLBaseBinding<'feed', { anchor: VecModel }>

export class FeedBindingUtil extends BindingUtil<FeedModelBinding>{
	static override type = 'feed' as const

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
		const feed = this.editor.getShape(binding.fromId)!

		const boundShape: any = this.editor.getShape(binding.toId)!

		this.editor.updateShape({
			id: feed.id,
			type: 'feed',
			x: boundShape.props.w+80,
			y: 0,
			props: {
				w: 400,
				h: boundShape.props.h,
			}
		})
	}

	// when the thing we're stuck to is deleted, delete the sticker too
	override onBeforeDeleteToShape({ binding }: BindingOnShapeDeleteOptions<FeedModelBinding>): void {
		this.editor.deleteShape(binding.fromId)
	}
}