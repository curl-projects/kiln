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

import React, { useCallback, useRef, useState, useEffect } from 'react'
import classNames from 'classnames'

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
 //  return false
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

        const [searchInput, setSearchInput] = useState(shape.props.name || "")
        const [isInputFocused, setIsInputFocused] = useState(false)

        const boxContainerRef: any = useRef();

        const handleSearch = () => {
            const feedBinding = this.editor.getBindingsFromShape(shape, 'searchFeedBinding')[0]
            // get bound concepts

            console.log("FEED BINDING:", feedBinding)
            if (feedBinding) {
                if(conceptChildren?.length !== 0){
                    const feed = this.editor.getShape(feedBinding.toId)
                    console.log("CONCEPT CHILDREN:", conceptChildren)
                    const result = "Articles about " + conceptChildren.map(concept => `${concept.props.plainText} (${concept.props.description})`).join(', ');

                    this.editor.updateShape({id: feed.id, type: feed.type, 
                        props: { 
                            searchQuery: result,
                            concepts: conceptChildren.map(concept => { return {name: concept.props.plainText, description: concept.props.description }}),
                        }
                    
                    })
                }
                else{
                    const feed = this.editor.getShape(feedBinding.toId)
                    this.editor.updateShape({id: feed.id, type: feed.type, props: { searchQuery: searchInput }})
                }
                
            }
        }

        useEffect(() => {
            if (shape.props.name !== searchInput) {
                setSearchInput(shape.props.name)
            }
        }, [shape.props.name])

        useEffect(() => {
            const handleResize = () => {
              if (boxContainerRef.current?.clientHeight) {
                this.editor.updateShape({
                  type: shape.type,
                  id: shape.id,
                  props: {
                    // w: boxContainerRef.current?.clientWidth,
                    h: boxContainerRef.current.clientHeight
                  }
                });
              }
            };
        
            const resizeObserver = new ResizeObserver(handleResize);
            if (boxContainerRef.current) {
              resizeObserver.observe(boxContainerRef.current);
            }
        
            return () => {
              if (boxContainerRef.current) {
                resizeObserver.unobserve(boxContainerRef.current);
              }
              resizeObserver.disconnect();
            };
          }, [boxContainerRef.current, this.editor, shape]);
        
return (
            <div 
            ref={boxContainerRef}
            className="kiln-feed-search-box"
                onMouseEnter={()=>{
                    console.log("Feed Entered")
                        this.editor.setEditingShape(shape)
                }}
            
            >
                <div 
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: 'fit-content',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                    }}
                >
                    {!isInputFocused && searchInput === "" && (
                        <p
                        style={{
                            fontWeight: 600,
                            fontSize: '12px',
                            color: "#63635E",
                            margin: 0,
                        }}
                        onPointerDown={() => setIsInputFocused(true)}
                    >
                        Articles about
                        {(conceptChildren && conceptChildren.length !== 0)
                            ? conceptChildren.map((concept, idx) => {
                                const isLast = idx === conceptChildren.length - 1;
                                const isSecondLast = idx === conceptChildren.length - 2;
                                const commaOrAnd = isLast ? '' : (isSecondLast ? ' and' : ',');
                    
                                return (
                                    <React.Fragment key={idx}>
                                        <SearchShapeConcept concept={concept} editor={this.editor} />
                                        {commaOrAnd}
                                    </React.Fragment>
                                );
                            })
                            : <span style={{marginLeft: '3px', color: "rgba(100, 99, 99, 0.4)"}}>...anything! Drag concepts in to search.</span>
                        }
                    </p>
                    
                    )}
                    <textarea 
                        value={searchInput} 
                        onChange={(e) => {
                            setSearchInput(e.target.value)
                            e.target.style.height = 'auto'; // Reset height to auto to get the correct scrollHeight
                            e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight    
                            this.editor.updateShape({
                                id: shape.id,
                                type: 'search',
                                props: { name: e.target.value }
                            })
                        }}
                        onKeyPress={(e) => {
                            stopEventPropagation;
                            e.stopPropagation();
                            e.key === 'Enter' && handleSearch()}
                        }
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        placeholder={isInputFocused ? "Enter search query" : ""}
                        rows={1} // Initial number of rows
                        style={{
                            width: isInputFocused ? 'fit-content' : "0%",
                            minWidth: isInputFocused ? '100%' : "0%",
                            height: 'auto', // Allow the height to adjust automatically
                            minHeight: '20px', // Minimum height for the textarea
                            border: 'none',
                            outline: 'none',
                            fontWeight: 600,
                            fontSize: '12px',
                            color: "#63635E",
                            background: 'transparent',
                            resize: 'none', // Prevent manual resizing, if desired
                            overflow: 'hidden', // Hide scrollbars 
                        }}
                    />
                    <div 
                        onPointerDown={() => {
                            console.log("CLICKED!")
                            handleSearch()}}
                        style={{
                            height: "100%",
                            width: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "center",
                            cursor: "pointer",
                            fontSize: '20px',
                        }}
                    >
                        <IoMdSearch/>
                    </div>
                </div>
            </div>
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