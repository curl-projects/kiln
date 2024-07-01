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

type SearchModelBinding = TLBaseBinding<'searchFeedBinding', { anchor: VecModel }>

export class SearchBindingUtil extends BindingUtil<SearchModelBinding>{
	static override type = 'searchFeedBinding' as const

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
		const search = this.editor.getShape(binding.fromId)!

		const boundShape: any = this.editor.getShape(binding.toId)!

		this.editor.updateShape({
			id: search.id,
			type: 'search',
			x: 0,
			y: 0,
			props: {
				w: boundShape.props.w,
			}
		})
	}

	// when the thing we're stuck to is deleted, delete the sticker too
	override onBeforeDeleteToShape({ binding }: BindingOnShapeDeleteOptions<SearchModelBinding>): void {
		this.editor.deleteShape(binding.fromId)
	}
}