import {
	Geometry2d,
	HTMLContainer,
	Rectangle2d,
	ShapeProps,
	ShapeUtil,
	T,
	TLBaseShape,
	TLOnResizeHandler,
	Tldraw,
	resizeBox,
} from 'tldraw'

type IFrameShape = TLBaseShape<
	'iFrame',
	{
		w: number
		h: number
		text: string
        url: string,
	}
>

// [2]
export class IFrameShapeUtil extends ShapeUtil<IFrameShape> {
	// [a]
	static override type = 'my-custom-shape' as const
	static override props: ShapeProps<IFrameShape> = {
		w: T.number,
		h: T.number,
		text: T.string,
        url: T.string,
	}

	// [b]
	getDefaultProps(): IFrameShape['props'] {
		return {
			w: 200,
			h: 200,
			text: "I'm a shape!",
            url: 'https://www.google.com',
		}
	}

	// [c]
	override canBind = () => true
	override canEdit = () => false
	override canResize = () => true
	override isAspectRatioLocked = () => false

	// [d]
	getGeometry(shape: IFrameShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	// [e]
	override onResize: TLOnResizeHandler<any> = (shape, info) => {
		return resizeBox(shape, info)
	}

	// [f]
	component(shape: IFrameShape) {
		return <HTMLContainer style={{ backgroundColor: '#efefef' }}>{shape.props.text}</HTMLContainer>
	}

	// [g]
	indicator(shape: IFrameShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}