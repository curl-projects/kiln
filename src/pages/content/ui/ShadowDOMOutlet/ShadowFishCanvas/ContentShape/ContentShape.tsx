import { useState } from 'react';
import { TLBaseShape, ShapeProps, ShapeUtil, Geometry2d, HTMLContainer, Rectangle2d, T } from 'tldraw';

// Define the shape type and properties
export type ContentShape = TLBaseShape<
    'content',
    {
        w: number,
        h: number,
        content: string,
        contentType: string
    }
>

// Create the utility class for the ContentShape
export class ContentShapeUtil extends ShapeUtil<ContentShape> {
    static override type = 'content' as const
    static override props: ShapeProps<ContentShape> = {
        w: T.number,
        h: T.number,
        content: T.string,
        contentType: T.string,
    }

    override isAspectRatioLocked = (_shape: ContentShape) => false
    override canResize = (_shape: ContentShape) => true
    override canBind = (_shape: ContentShape) => true
    override hideSelectionBoundsFg = (_shape: ContentShape) => false
    override hideSelectionBoundsBg = (_shape: ContentShape) => false
    override hideResizeHandles = (_shape: ContentShape) => false
    override hideRotateHandle = (_shape: ContentShape) => true

    // Define the geometry for the shape
    getGeometry(shape: ContentShape): Geometry2d {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        })
    }

    // Define the component to be rendered
    component(shape: ContentShape) {
        return (
            <HTMLContainer
                id={shape.id}
                style={{
					border: '1px solid black',
					color: "#898E87",
					pointerEvents: 'all',
					margin: 0,
					fontSize: shape.props.contentType === 'header' ? '40px' : '20px',
					fontWeight: shape.props.contentType === 'header' ? 'bold' : 'normal',
				}}
            >
                {shape.props.content}
            </HTMLContainer>
        )
    }

    // Define default properties for the shape
    getDefaultProps(): ContentShape['props'] {
        return {
            w: 200,
            h: 200,
            content: 'Type your text here...',
            contentType: 'paragraph',
        }
    }

    // Optionally, define an indicator if needed
    indicator(shape: ContentShape) {
        return <rect width={shape.props.w} height={shape.props.h} />;
    }
}
