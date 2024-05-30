import { useState } from 'react'
// import FishAgent from "@root/src/pages/content/ui/LocalComponents/FishAgent/FishAgent.jsx";

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

export type FishShape = TLBaseShape<
	'fish',
	{
		w: number,
		h: number,
        config: string,
        personality: string,
	}
>


export class FishShapeUtil extends ShapeUtil<FishShape> {
	static override type = 'fish' as const
	// [1]
	static override props: ShapeProps<FishShape> = {
        w: T.number,
	    h: T.number,
        config: T.string,
        personality: T.string,
    }
	// [2]
	// static override migrations = cardShapeMigrations

	// [3]
	override isAspectRatioLocked = (_shape: FishShape) => false
	override canResize = (_shape: FishShape) => false
	override canBind = (_shape: FishShape) => true
    override hideSelectionBoundsFg = (_shape: FishShape) => true
    override hideSelectionBoundsBg = (_shape: FishShape) => true
    override hideResizeHandles = (_shape: FishShape) => true
    override hideRotateHandle = (_shape: FishShape) => true

	// [4]
	
	// [5]
	getGeometry(shape: FishShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	// [6]
	component(shape: FishShape) {
        
        console.log("SHAPE", shape)
        // console.log("HI!", shape.props.children)
		return (
			<HTMLContainer
				id={shape.id}
				style={{
					border: '1px solid black',
					height: "fit-content",
                    width: 'fit-content',
					pointerEvents: 'all',
				}}
			>
                {{
                    'fish': <FishAgent />
                }[shape.props.config]}
			</HTMLContainer>
		)
	}

    getDefaultProps(): FishShape['props'] {
		return {
			w: 300,
			h: 300,
            config: 'fish',
            personality: 'helper',
		}
	}


	// [7]
	// indicator(shape: FishShape) {
	// 	return <rect width={shape.props.w} height={shape.props.h} />
	// }

    indicator(shape: FishShape) {
        return null
    }

	// [8]
	// override onResize: TLOnResizeHandler<FishShape> = (shape, info) => {
	// 	return resizeBox(shape, info)
	// }
}