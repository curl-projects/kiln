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
import React, { createElement } from 'react'

type IFrameShape = TLBaseShape<
	'iFrame',
	{
		w: number
		h: number
        url: string
	}
>

export const Iframe = React.memo((props) => React.createElement('iframe', props));

// [2]
export class IFrameShapeUtil extends ShapeUtil<IFrameShape> {
	// [a]
	static override type = 'iFrame' as const
	static override props: ShapeProps<IFrameShape> = {
		w: T.number,
		h: T.number,
        url: T.string,
	}

	// [b]
	getDefaultProps(): IFrameShape['props'] {
		return {
			w: 400,
			h: 400,
            url: 'https://github.com/tldraw/tldraw',
		}
	}

	// [c]
	override canBind = () => false
	override canEdit = () => false
	override canResize = () => false
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
		// return resizeBox(shape, info)
		return null
	}

	// [f]
	component(shape: IFrameShape) {
		console.log("DOCUMENT ELEMENT", document.documentElement.outerHTML)

		const domHTML = document.documentElement.outerHTML

		return (
		<HTMLContainer className='iframeWrapper'>
			<Iframe 
				srcDoc={domHTML}
				height={`${shape.props.h}px`}
				width={`${shape.props.w}px`}
				x={200}
				y={200}
		/>
		</HTMLContainer>
		)
	}

	// [g]
	indicator(shape: IFrameShape) {
		return null
		// return <rect width={shape.props.w} height={shape.props.h} />
	}
}