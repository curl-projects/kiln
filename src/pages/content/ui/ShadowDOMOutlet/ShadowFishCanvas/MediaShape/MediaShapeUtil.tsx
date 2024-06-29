import {
	BaseBoxShapeUtil,
	Geometry2d,
	Rectangle2d,
	SVGContainer,
	SvgExportContext,
	TLFrameShape,
	TLGroupShape,
	getPointerInfo,
	TLOnResizeHandler,
	TLShape,
	canonicalizeRotation,
	TLUnknownShape,
	frameShapeMigrations,
	frameShapeProps,
	getDefaultColorTheme,
	resizeBox,
	toDomPrecision,
	TLBaseShape,
	useValue,
	HTMLContainer,
	stopEventPropagation,
	TLOnBeforeCreateHandler,
	TLOnTranslateStartHandler,
	TLOnChildrenChangeHandler,
} from '@tldraw/editor'
import { T, createShapeId } from 'tldraw';
import { useResizeCreated } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/CustomUI/useJustCreated"
import { useCallback, useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import Linter, { BadWords } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/CustomUI/TextExtensions/LinterExtension"
import { ColorHighlighter } from '../CustomUI/TextExtensions/HighlightExtension/HighlightExtension';
import Placeholder from '@tiptap/extension-placeholder'
import { Shapes } from 'lucide-react';

const mediaShapeProps = {
	w: T.number,
	h: T.number,
	text: T.string,
	concepts: T.array
}

type MediaShape = TLBaseShape<
	'media',
	{
		w: number
		h: number
		text: string
		concepts: any
	}
>

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/** @public */
export class MediaShapeUtil extends BaseBoxShapeUtil<MediaShape> {
	static override type = 'media' as const
	static override props = mediaShapeProps

	override canEdit = () => true

getDefaultProps(): MediaShape['props'] {
		return { 
			w: 300,
			h: 300,
			text: JSON.stringify(""),
			concepts: [
				{"type": "concept", "text": JSON.stringify("Human Computer Interaction")},
				{"type": "concept", "text": JSON.stringify("The Self & Media")}
			  ]			  
		}
	}

	getGeometry(shape: MediaShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	component(shape: MediaShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds
		const isSelected = shape.id === this.editor.getOnlySelectedShapeId();
		const shapeRef = useRef<HTMLDivElement>();
		const [highlightedTexts, setHighlightedTexts] = useState('Hello')
		const [activeView, setActiveView] = useState('media')

		useEffect(()=>{
			if(activeView === 'media'){
				const bindings = this.editor.getBindingsToShape(shape, 'mediaConcept')
				for(let bind of bindings){
					const boundConcept = this.editor.getShape(bind.fromId)
					this.editor.updateShape({id: boundConcept.id, type: boundConcept.type, opacity: 0, isLocked: true})
				}
			}
			else if(activeView === 'concepts'){
				const bindings = this.editor.getBindingsToShape(shape, 'mediaConcept')
				for(let bind of bindings){
					const boundConcept = this.editor.getShape(bind.fromId)
					this.editor.updateShape({id: boundConcept.id, type: boundConcept.type, opacity: 1, isLocked: false})
				}
			}
		}, [activeView])

		const editor = useEditor({
			extensions: [
			  Document,
			  Paragraph,
			  Text,
			  Placeholder.configure({
				placeholder: "Capture ideas..."
			  }),
			  ColorHighlighter.configure({
				data: ['Hello']
			  }),
			],
			content: JSON.parse(shape.props.text),
		
			onUpdate: ({ editor }) => {
				stopEventPropagation;
				const jsonContent = JSON.stringify(editor.getJSON())
				this.editor.updateShape<MediaShape>({
					id: shape.id,
					type: 'media',
					props: {
						text: jsonContent,
						h: Math.max(shape.props.h, shapeRef.current.clientHeight)
					}
				})
			},
			onSelectionUpdate: ({ editor }) => {
			//   stopEventPropagation;
			}
		  });

		  useEffect(() => {
			if (editor) {
			  editor.commands.updateData({data: highlightedTexts.split(',')})
			}
		  }, [highlightedTexts, editor]);
		

		
		return (
			<HTMLContainer 
				id={shape.id}
				
				style={{
					pointerEvents: 'all',
				}}
				>
				<div style={{
					minHeight: "100%",
					minWidth: '100%',
					backgroundColor: '#FFFFFF', 
					boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
					borderRadius: '12px',
					pointerEvents: 'all',	
					border: "1px solid rgba(255, 255, 255, 0.95)",
					padding: '28px 24px',
				}}
				ref={shapeRef}
				>
					<div style={{
						display: 'flex',
						gap: '8px', 
						justifyContent: 'flex-start',
						alignItems: 'center',
					}}>
						<svg style={{ flexShrink: 0, opacity: activeView === 'concepts' ? 0.2 : 1, }} width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M5.36588 1.59401C2.8065 1.59401 0.731709 3.66881 0.731709 6.22819C0.731709 8.78754 2.8065 10.8623 5.36588 10.8623C7.92528 10.8623 10.0001 8.78754 10.0001 6.22819C10.0001 3.66881 7.92528 1.59401 5.36588 1.59401ZM0 6.22819C0 3.26469 2.40239 0.862305 5.36588 0.862305C8.32935 0.862305 10.7318 3.26469 10.7318 6.22819C10.7318 9.19168 8.32935 11.5941 5.36588 11.5941C2.40239 11.5941 0 9.19168 0 6.22819Z" fill="#191400" fillOpacity="0.207843"/>
							<path fillRule="evenodd" clipRule="evenodd" d="M10.2444 6.55373H0.488281V5.90332H10.2444V6.55373Z" fill="#191400" fillOpacity="0.207843"/>
							<path fillRule="evenodd" clipRule="evenodd" d="M5.04005 11.1064V1.35021H5.69046V11.1064H5.04005ZM7.70274 6.22827C7.70274 4.46181 7.06748 2.71427 5.8221 1.5588L6.20918 1.1416C7.59266 2.42516 8.27185 4.33619 8.27185 6.22827C8.27185 8.12037 7.59266 10.0314 6.20918 11.315L5.8221 10.8977C7.06748 9.7423 7.70274 7.99475 7.70274 6.22827ZM2.51953 6.22829C2.51953 4.33894 3.17658 2.4289 4.51791 1.14467L4.91148 1.55575C3.70532 2.71057 3.08864 4.45908 3.08864 6.22829C3.08865 7.9975 3.70534 9.74604 4.9115 10.9008L4.51792 11.3119C3.1766 10.0277 2.51954 8.11765 2.51953 6.22829Z" fill="#191400" fillOpacity="0.207843"/>
							<path fillRule="evenodd" clipRule="evenodd" d="M5.3641 3.34863C7.12778 3.34863 8.92131 3.67476 10.137 4.3539C10.2742 4.43054 10.3233 4.60389 10.2467 4.7411C10.1701 4.87829 9.99668 4.92739 9.85952 4.85075C8.76204 4.2377 7.07795 3.91774 5.3641 3.91774C3.65023 3.91774 1.96616 4.2377 0.868689 4.85075C0.731485 4.92739 0.558134 4.87829 0.481492 4.7411C0.404857 4.60389 0.453947 4.43054 0.591151 4.3539C1.80692 3.67476 3.6004 3.34863 5.3641 3.34863ZM5.3641 8.95191C7.12778 8.95191 8.92131 8.62573 10.137 7.94662C10.2742 7.86999 10.3233 7.69663 10.2467 7.55943C10.1701 7.42223 9.99668 7.37314 9.85952 7.44977C8.76204 8.06282 7.07795 8.3828 5.3641 8.3828C3.65023 8.3828 1.96616 8.06282 0.868689 7.44978C0.731485 7.37314 0.558134 7.42223 0.481492 7.55943C0.404857 7.69663 0.453947 7.86999 0.591151 7.94662C1.80692 8.62573 3.6004 8.95191 5.3641 8.95191Z" fill="#191400" fillOpacity="0.207843"/>
						</svg>
						<p style={{
							margin: 0,
							color: "#82827C", 
							fontSize: '12px',
							fontStyle: 'italic',
							textTransform: 'capitalize',
							fontWeight: '460',
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							overflow: "hidden",
							maxWidth: "90%",
							opacity: activeView === 'concepts' ? 0.2 : 1,

						}}>Original Thought</p>
						<div style={{flex: 1}}/>
						<div
						className="tl-media-concept-toggle"
						onPointerDown={(e)=>{
							activeView === 'media' 
							? setActiveView('concepts')
							: setActiveView('media')
						
							}
						}
						>
							{activeView === 'media'
							?
							<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path fillRule="evenodd" clipRule="evenodd" d="M4.24206 14.4874V13.0315H4.2412L5.97585 7.25305L3.83909 0L0 13.0315H3.21818V14.4874H4.24206ZM8.95148 0L12.791 13.0315H9.49929V16.2347H8.47541V13.0315H5.11194L8.95148 0ZM13.6805 13.0315H13.6813V14.4874H14.7052V13.0315H17.9972L14.1576 0L11.9913 7.35243L13.6805 13.0315Z" fill="#D0CED4"/>
							</svg>

							:
							<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
								<mask id="path-1-inside-1_186_5934" fill="white">
								<path fillRule="evenodd" clipRule="evenodd" d="M4.24011 14.4874V13.0315H4.23925L5.9739 7.25305L3.83714 0L-0.00195312 13.0315H3.21623V14.4874H4.24011ZM8.94953 0L12.7891 13.0315H9.49734V16.2347H8.47346V13.0315H5.10999L8.94953 0ZM13.6786 13.0315H13.6794V14.4874H14.7033V13.0315H17.9952L14.1557 0L11.9894 7.35243L13.6786 13.0315Z"/>
								</mask>
								<path fillRule="evenodd" clipRule="evenodd" d="M4.24011 14.4874V13.0315H4.23925L5.9739 7.25305L3.83714 0L-0.00195312 13.0315H3.21623V14.4874H4.24011ZM8.94953 0L12.7891 13.0315H9.49734V16.2347H8.47346V13.0315H5.10999L8.94953 0ZM13.6786 13.0315H13.6794V14.4874H14.7033V13.0315H17.9952L14.1557 0L11.9894 7.35243L13.6786 13.0315Z" fill="#D0CED4"/>
								<path d="M4.24011 13.0315H5.24011V12.0315H4.24011V13.0315ZM4.24011 14.4874V15.4874H5.24011V14.4874H4.24011ZM4.23925 13.0315L3.28147 12.744L2.89497 14.0315H4.23925V13.0315ZM5.9739 7.25305L6.93167 7.54057L7.01718 7.25573L6.93314 6.97046L5.9739 7.25305ZM3.83714 0L4.79638 -0.282593L3.83714 -3.53866L2.8779 -0.282593L3.83714 0ZM-0.00195312 13.0315L-0.961193 12.7489L-1.33905 14.0315H-0.00195312V13.0315ZM3.21623 13.0315H4.21623V12.0315H3.21623V13.0315ZM3.21623 14.4874H2.21623V15.4874H3.21623V14.4874ZM12.7891 13.0315V14.0315H14.1262L13.7483 12.7489L12.7891 13.0315ZM8.94953 0L9.90876 -0.282623L8.94953 -3.53829L7.99029 -0.282623L8.94953 0ZM9.49734 13.0315V12.0315H8.49734V13.0315H9.49734ZM9.49734 16.2347V17.2347H10.4973V16.2347H9.49734ZM8.47346 16.2347H7.47346V17.2347H8.47346V16.2347ZM8.47346 13.0315H9.47346V12.0315H8.47346V13.0315ZM5.10999 13.0315L4.15076 12.7489L3.77285 14.0315H5.10999V13.0315ZM13.6794 13.0315H14.6794V12.0315H13.6794V13.0315ZM13.6786 13.0315L12.7201 13.3166L12.9327 14.0315H13.6786V13.0315ZM13.6794 14.4874H12.6794V15.4874H13.6794V14.4874ZM14.7033 14.4874V15.4874H15.7033V14.4874H14.7033ZM14.7033 13.0315V12.0315H13.7033V13.0315H14.7033ZM17.9952 13.0315V14.0315H19.3323L18.9544 12.7489L17.9952 13.0315ZM14.1557 0L15.1149 -0.282623L14.1557 -3.53829L13.1964 -0.282623L14.1557 0ZM11.9894 7.35243L11.0302 7.0698L10.9465 7.35377L11.0309 7.63752L11.9894 7.35243ZM3.24011 13.0315V14.4874H5.24011V13.0315H3.24011ZM4.23925 14.0315H4.24011V12.0315H4.23925V14.0315ZM5.01612 6.96554L3.28147 12.744L5.19702 13.319L6.93167 7.54057L5.01612 6.96554ZM2.8779 0.282593L5.01466 7.53565L6.93314 6.97046L4.79638 -0.282593L2.8779 0.282593ZM0.957287 13.3141L4.79638 0.282593L2.8779 -0.282593L-0.961193 12.7489L0.957287 13.3141ZM3.21623 12.0315H-0.00195312V14.0315H3.21623V12.0315ZM4.21623 14.4874V13.0315H2.21623V14.4874H4.21623ZM4.24011 13.4874H3.21623V15.4874H4.24011V13.4874ZM13.7483 12.7489L9.90876 -0.282623L7.99029 0.282623L11.8298 13.3141L13.7483 12.7489ZM9.49734 14.0315H12.7891V12.0315H9.49734V14.0315ZM10.4973 16.2347V13.0315H8.49734V16.2347H10.4973ZM8.47346 17.2347H9.49734V15.2347H8.47346V17.2347ZM7.47346 13.0315V16.2347H9.47346V13.0315H7.47346ZM5.10999 14.0315H8.47346V12.0315H5.10999V14.0315ZM7.99029 -0.282623L4.15076 12.7489L6.06922 13.3141L9.90876 0.282623L7.99029 -0.282623ZM13.6794 12.0315H13.6786V14.0315H13.6794V12.0315ZM14.6794 14.4874V13.0315H12.6794V14.4874H14.6794ZM14.7033 13.4874H13.6794V15.4874H14.7033V13.4874ZM13.7033 13.0315V14.4874H15.7033V13.0315H13.7033ZM17.9952 12.0315H14.7033V14.0315H17.9952V12.0315ZM13.1964 0.282623L17.036 13.3141L18.9544 12.7489L15.1149 -0.282623L13.1964 0.282623ZM12.9486 7.63505L15.1149 0.282623L13.1964 -0.282623L11.0302 7.0698L12.9486 7.63505ZM14.6371 12.7464L12.9479 7.06733L11.0309 7.63752L12.7201 13.3166L14.6371 12.7464Z" fill="#63635E" mask="url(#path-1-inside-1_186_5934)"/>
							</svg>
							}
						</div>
					</div>
					<EditorContent 
						editor={editor}
						onKeyDown={stopEventPropagation}
						style={{
							fontWeight: 500,
							color: "#63635E",
							letterSpacing: '-0.00em',
							lineHeight: '21px',
							fontSize: '14px',
							opacity: activeView === 'concepts' ? 0.2 : 1,
						}}
					/>
					<input
					type="text"
					value={highlightedTexts}
					onKeyDown={stopEventPropagation}
					onChange={(e) => setHighlightedTexts(e.target.value)}
					placeholder="Enter highlight texts, separated by commas"
					style={{
						opacity: activeView === 'concepts' ? 0.2 : 1,
					}}
      			/>
				</div>
				{/* <SVGContainer>
					<rect
						width={bounds.width}
						height={bounds.height}
						rx="12"
						ry="12"
						fill="#F9F9F8"
						strokeWidth="1"
						stroke="#DDDDDA"
						filter="url(#boxShadow)"

					/>
				</SVGContainer> */}
				
			</HTMLContainer>
		)
	}

	indicator(shape: MediaShape) {
		return <rect width={shape.props.w} height={shape.props.h} rx="12px" ry="12px"/>

	}

	override canReceiveNewChildrenOfType = (shape: TLShape, _type: TLShape['type']) => {
		return !shape.isLocked
	}

	providesBackgroundForChildren(): boolean {
		return true
	}

	override canDropShapes = (shape: MediaShape, shapes: TLShape[]): boolean => {
		if(shapes.every((s) => s.type === 'concept')){
			return true
		}
		else{
			return false
		}
	}

	override onDragShapesOver = (frame: MediaShape, shapes: TLShape[]) => {
		if (!shapes.every((child) => child.parentId === frame.id)) {
			this.editor.reparentShapes(shapes, frame.id)
		}
	}

	override onDragShapesOut = (_shape: MediaShape, shapes: any): void => {
		console.log("DRAGGED OUT")
		const parent = this.editor.getShape(_shape.parentId)
		const isInGroup = parent && this.editor.isShapeOfType<TLGroupShape>(parent, 'group')

		const remainingChildren: any = this.editor.getSortedChildIdsForParent(_shape).map(id => this.editor.getShape(id))
		
		// update new concept in shape if old one is moved out
		for(let dragShape of shapes){
			if(dragShape.type === 'concept'){
				// remove the media binding from the concept
				const conceptBinding: any = this.editor.getBindingsFromShape(dragShape, 'mediaConcept')[0]


				this.editor.deleteBinding(conceptBinding.id)

				// if a copy of the concept exists, change its opacity to 1 
				for(let child of remainingChildren){
					if(child.props.text === dragShape.props.text){
						this.editor.updateShape({...child, opacity: 1})
					}
				}

				console.log("CONCEPT DRAGGED OUT", dragShape)
				
			}
		}

		// If frame is in a group, keep the shape
		// moved out in that group

		if (isInGroup) {
			this.editor.reparentShapes(shapes, parent.id)
		} else {
			this.editor.reparentShapes(shapes, this.editor.getCurrentPageId())
		}
	}

	override onResize: TLOnResizeHandler<any> = (shape, info) => {
		return resizeBox(shape, info)
	}

	override onChildrenChange: TLOnChildrenChangeHandler<MediaShape> = (shape) => {
		// console.log("SHAPE:", shape)
		// const mediaChildren = this.editor.getSortedChildIdsForParent(shape)

		// for(let childShapeId of mediaChildren){
		// 	const childShape = this.editor.getShape(childShapeId)
		// 	if(childShape.opacity !== 1){
		// 		this.editor.updateShape({...shape, opacity: 1})
		// 	}
		// }
	}


	override onTranslateStart: TLOnTranslateStartHandler<MediaShape> = (shape) => {
		console.log("TRANSLATION STARTED")
		// this.editor.duplicateShapes([shape])
	}

}