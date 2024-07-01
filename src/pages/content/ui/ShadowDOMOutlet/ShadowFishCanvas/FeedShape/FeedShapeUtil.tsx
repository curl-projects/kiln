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
	TLBaseShape,
	getDefaultColorTheme,
	resizeBox,
	toDomPrecision,
	useValue,
	HTMLContainer,
	stopEventPropagation,
	createShapeId,
} from '@tldraw/editor'
import { Expand } from '@tldraw/utils'
import { handleFeedSearch } from '@pages/content/ui/ServerFuncs/api'
import { FeedCard } from "./FeedCard"
import { IoMdSearch } from "react-icons/io";

import { useCallback, useState, useEffect } from 'react'
import classNames from 'classnames'
import { useRef } from 'react';

export const feedShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	name: T.string,
    searchQuery: T.string,
}

export type RecordPropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
	[K in keyof Config]: T.TypeOf<Config[K]>
}>

export type FeedShapeProps = RecordPropsType<typeof feedShapeProps>

/** @public */
export type FeedModelShape = TLBaseShape<'feed', FeedShapeProps>



/** @public */
export class FeedShapeUtil extends BaseBoxShapeUtil<FeedModelShape> {
	static override type = 'feed' as const
	static override props = feedShapeProps
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

	override getDefaultProps(): FeedModelShape['props'] {
		return { w: 160 * 2, h: 90 * 2, name: '', searchQuery: ""}
	}

	override getGeometry(shape: FeedModelShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: false,

		})
	}

	override component(shape: FeedModelShape) {
		const [selectedOutput, setSelectedOutput] = useState(null);
        const [queryResults, setQueryResults] = useState([{text: "Hello my name is Finn", url: "https://github.com/tldraw/tldraw/blob/d6469945542a77f29e0a3281b8e15c79e3780fed/packages/editor/src/lib/app/tools/SelectTool/children/Translating.ts", title: "Test Media"}, {text: "Hello my name is Finn", url: "https://github.com/tldraw/tldraw/blob/d6469945542a77f29e0a3281b8e15c79e3780fed/packages/editor/src/lib/app/tools/SelectTool/children/Translating.ts", title: "Test Media"}, {text: "Hello my name is Finn", url: "https://github.com/tldraw/tldraw/blob/d6469945542a77f29e0a3281b8e15c79e3780fed/packages/editor/src/lib/app/tools/SelectTool/children/Translating.ts", title: "Test Media"}])
		const bounds = this.editor.getShapeGeometry(shape).bounds
        const searchBoxRef: any = useRef();

        useEffect(() => {
            async function feedFetch(){
                if(shape.props.searchQuery){
                    const results = await handleFeedSearch('hottest AI Startups')
                    setQueryResults(results)
                }
            } 
        }, [shape.props.searchQuery])

	
		return (
            <HTMLContainer 

            onMouseEnter={()=>{
                this.editor.setEditingShape(shape)
            }}
            onMouseDown={()=>{
                this.editor.setEditingShape(shape)
            }}
            style={{
                position: 'relative',
                backgroundColor: "transparent",
            }}>
			<div 
                className='kiln-feed-box'
				style={{
                    position: 'relative', 
                    boxSizing: 'border-box',
                    width: bounds.width,
					height: bounds.height,
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: '1px solid #DDDDDA',
                    boxShadow: "0px 36px 21px rgba(77, 77, 77, 0.15)",
                    overflow: "scroll",
                    display: 'flex',
                    // paddingTop: , 
                    // TODO: padding top logic
                    flexDirection: 'column',
                    gap: '20px',
                }} 
				onPointerDown={stopEventPropagation}>
                {queryResults && queryResults.map((result, idx) => 
                   <FeedCard key={idx} idx={idx} result={result} editor={this.editor}/>
                )}
                </div>
                {/* <div 
                    className="kiln-feed-search-box"
                    ref={searchBoxRef}
                    onMouseDown={async()=>{
                        const results = await handleFeedSearch('hottest AI startups')
                        setQueryResults(results)
                    }}
                >
                <p style={{
                    fontWeight: 500,
                    fontSize: '12px',
                    color: "#63635E",

                }}>Articles about Re-imagining the relationship between software and humans from the internet</p>
                <div style={{flex: 1}}/>
                <div style={{
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
                </div> */}
                {/* <div 
                    style={{
                        position: 'absolute',
                        top: "0px",
                        left: 0,
                        zIndex: '100',
                        height: '120px',
                        width: '100%',
                        pointerEvents: 'all',
                        border: '2px solid green',
                        background: "linear-gradient(rgba(255,255, 255, 1), rgba(255, 255, 255, 0))",
                    }}
                /> */}
                  <div 
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        zIndex: '100',
                        height: '60px',
                        width: '100%',
                        pointerEvents: 'all',
                        background: "linear-gradient(to bottom, rgba(255,255, 255,0), rgba(255, 255, 255, 1))",
                    }}
                />
			</HTMLContainer>
		)
	}

	indicator(shape: FeedModelShape) {
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


    override canDropShapes = (shape: FeedModelShape, _shapes: TLShape[]): boolean => {
		return !shape.isLocked
	}
}