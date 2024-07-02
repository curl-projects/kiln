import {
	BaseBoxShapeUtil,
	Geometry2d,
	Rectangle2d,
	SVGContainer,
	SvgExportContext,
	TLGroupShape,
	getPointerInfo,
	TLOnResizeHandler,
	TLShape,
	canonicalizeRotation,
	frameShapeMigrations,
	frameShapeProps,
	T,
	invLerp,
    TLOnChildrenChangeHandler,
	TLBaseShape,
	getDefaultColorTheme,
	resizeBox,
	toDomPrecision,
	useValue,
	HTMLContainer,
	stopEventPropagation,
	createShapeId,
    TLOnDragHandler,
} from '@tldraw/editor'
import { Expand } from '@tldraw/utils'
import { handleFeedSearch } from '@pages/content/ui/ServerFuncs/api'
import { IoMdSearch } from "react-icons/io";
import { SearchShapeConcept } from "./SearchShapeConcept"

import { useCallback, useState, useEffect } from 'react'
import classNames from 'classnames'
import { useRef } from 'react';

export function last<T>(arr: readonly T[]): T | undefined {
	return arr[arr.length - 1]
}
export function defaultEmptyAs(str: string, dflt: string) {
	if (str.match(/^\s*$/)) {
		return dflt
	}
	return str
}
export const searchShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	name: T.string,
}

export type RecordPropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
	[K in keyof Config]: T.TypeOf<Config[K]>
}>

export type SearchShapeProps = RecordPropsType<typeof searchShapeProps>

/** @public */
export type SearchShape = TLBaseShape<'search', SearchShapeProps>



/** @public */
export class SearchShapeUtil extends BaseBoxShapeUtil<SearchShape> {
	static override type = 'search' as const
	static override props = searchShapeProps
	static override migrations = frameShapeMigrations

	// override canEdit = (shape) => {
	// 	return false
	// }

    override canEdit = () => true

    override canScroll = () => true

	override canBind(){
		return true
	}

	override canCrop = () => true

	override getDefaultProps(): SearchShape['props'] {
		return { w: 160 * 2, h: 60, name: ''}
	}

	override getGeometry(shape: SearchShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: false,
		})
	}

	override component(shape: SearchShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds

        const conceptChildren: any = this.editor.getSortedChildIdsForParent(shape).map(childId => this.editor.getShape(childId)).filter(child => child.type === 'concept')

        useEffect(()=>{
            console.log("CONCEPT CHILDREN:", conceptChildren)
        }, [conceptChildren])


		return (
        <HTMLContainer className="kiln-feed-search-box">
            <p style={{
                fontWeight: 600,
                fontSize: '12px',
                color: "#63635E",
                display: "flex",
                alignItems: 'center',

            }}>Articles about
            {(conceptChildren && conceptChildren.length !== 0)
            
            ? conceptChildren.map((concept, idx) => 
                <SearchShapeConcept key={idx} concept={concept} editor={this.editor}/>)
            : <span style={{marginLeft: '3px', color: "rgba(100, 99, 99, 0.4)"}}>...anything! Drag concepts in to search.</span>
        }
            </p>
            <div style={{flex: 1}}/>
            <div 
            onMouseDown={()=>{
                const feedBinding = this.editor.getBindingsFromShape(shape, 'searchFeedBinding')[0]
                const feed = this.editor.getShape(feedBinding.toId)

                // send data to bound shape 
                // TODO FIX:
                this.editor.updateShape({id: feed.id, type: feed.type, props: { searchQuery: `Articles about ${conceptChildren.map(el => el.props.text).join(",")}`}})
            }}
            style={{
                height: "100%",
                width: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                cursor: "pointer",
                fontSize: '20px',
            }}>
                <IoMdSearch/>
            </div>
        </HTMLContainer>
		)
	}

	indicator(shape: SearchShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds

		return (
			<rect
				rx="12"
				ry="12"
				width={toDomPrecision(bounds.width)}
				height={toDomPrecision(bounds.height)}
				className={`tl-frame-indicator`}
			/>
		)
	}

	override onResize: TLOnResizeHandler<any> = (shape, info) => {		
		return resizeBox(shape, info)
	}


    override canDropShapes = (shape: SearchShape, shapes: TLShape[]): boolean => {
		if(shapes.every((s) => s.type === 'concept')){
			return true
		}
		else{
			return false
		}
	}

    override onDragShapesOver = (frame: SearchShape, shapes: TLShape[]) => {
		if (!shapes.every((child) => child.parentId === frame.id)) {
			this.editor.reparentShapes(shapes, frame.id)
		}
	}
    
    override onDragShapesOut = (shape: SearchShape, shapes: any): void => {
        const parent = this.editor.getShape(shape.parentId)
		const isInGroup = parent && this.editor.isShapeOfType<TLGroupShape>(parent, 'group')

        if (isInGroup) {
			this.editor.reparentShapes(shapes, parent.id)
		} else {
			this.editor.reparentShapes(shapes, this.editor.getCurrentPageId())
		}
    }

    override onDropShapesOver = (shape: SearchShape, shapes: any): void => {
        for(let childShape of shapes){
            if(childShape.type === 'concept'){
                this.editor.updateShape({id: childShape.id, type: childShape.id, opacity: 0, isLocked: true})
            }
        }
    }

    override onChildrenChange: TLOnChildrenChangeHandler<SearchShape> = (shape) => {
        // get children and re-render text
	}

}
