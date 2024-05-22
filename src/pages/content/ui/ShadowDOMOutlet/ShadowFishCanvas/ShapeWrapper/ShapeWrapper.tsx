import { useState } from 'react'
import FishAgent from "@pages/content/ui/LocalComponents/FishAgent/FishAgent.jsx";

import {
    EnumStyleProp,
	Geometry2d,
	HTMLContainer,
	Rectangle2d,
	ShapeUtil,
	TLOnResizeHandler,
	getDefaultColorTheme,
	resizeBox,
    DefaultColorStyle, 
    ShapeProps,
    T,
    TLBaseShape,
    TLDefaultColorStyle
} from 'tldraw'

// import { cardShapeMigrations } from './card-shape-migrations'

export type ICardShape = TLBaseShape<
	'finnCard',
	{
		w: number
		h: number
		color: TLDefaultColorStyle,
        config: string,
	}
>


export class CardShapeUtil extends ShapeUtil<ICardShape> {
	static override type = 'finnCard' as const
	// [1]
	static override props: ShapeProps<ICardShape> = {
        w: T.number,
	    h: T.number,
	    color: DefaultColorStyle,    
        config: T.string,
    }
	// [2]
	// static override migrations = cardShapeMigrations

	// [3]
	override isAspectRatioLocked = (_shape: ICardShape) => false
	override canResize = (_shape: ICardShape) => true
	override canBind = (_shape: ICardShape) => true

	// [4]
	getDefaultProps(): ICardShape['props'] {
		return {
			w: 300,
			h: 300,
			color: 'black',
            config: 'fish',
		}
	}

	// [5]
	getGeometry(shape: ICardShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	// [6]
	component(shape: ICardShape) {
        
        console.log("SHAPE", shape)
        // console.log("HI!", shape.props.children)
		return (
			<HTMLContainer
				id={shape.id}
				style={{
					border: '1px solid black',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'all',
				}}
			>
                {/* {{
                    'fish': <FishAgent />
                }[shape.props.children]} */}

                <h1>{shape.props.config}</h1>
			</HTMLContainer>
		)
	}

	// [7]
	indicator(shape: ICardShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}

	// [8]
	override onResize: TLOnResizeHandler<ICardShape> = (shape, info) => {
		return resizeBox(shape, info)
	}
}