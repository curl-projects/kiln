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
	TLOnTranslateStartHandler,
	TLOnTranslateEndHandler,
} from '@tldraw/editor'
import { T, createShapeId } from 'tldraw';
import { useCallback, useState, useEffect, useRef, useLayoutEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Node } from "@tiptap/core";
import Placeholder from '@tiptap/extension-placeholder'

const conceptShapeProps = {
	w: T.number,
	h: T.number,
	text: T.any,
	plainText: T.any,
	activated: T.boolean,
	description: T.string,
	temporary: T.boolean,
	colors: T.array,
}

type ConceptShape = TLBaseShape<
	'concept',
	{
		w: number
		h: number
		text: any,
		plainText: any,
		activated: boolean,
		temporary: boolean,
		colors: any,
		description: string,
	}
>

const OneLiner = Node.create({
	name: "oneLiner",
	topNode: true,
	content: "block",
  });
 
export const conceptColors = [
	'rgb(187, 170, 204)',
	'rgb(130, 162, 223)',
	'rgb(208, 228, 150)',
	'rgb(150, 228, 209)',
	'rgb(22, 101, 82)',
	'rgb(54, 67, 15)',
	'rgb(255, 45, 85)'
]


  function getEncapsulatingCircle(shape1, shape2) {
	// Calculate the boundaries of the smallest containing rectangle
	const minX = Math.min(shape1.x, shape2.x);
	const minY = Math.min(shape1.y, shape2.y);
	const maxX = Math.max(shape1.x + shape1.props.w, shape2.x + shape2.props.w);
	const maxY = Math.max(shape1.y + shape1.props.h, shape2.y + shape2.props.h);
  
	// Calculate the center of the smallest containing rectangle
	const centerX = (minX + maxX) / 2;
	const centerY = (minY + maxY) / 2;
  
	// Calculate the radius of the smallest circle that encapsulates the rectangle
	const distanceToCorner1 = Math.hypot(centerX - minX, centerY - minY);
	const distanceToCorner2 = Math.hypot(centerX - maxX, centerY - minY);
	const distanceToCorner3 = Math.hypot(centerX - minX, centerY - maxY);
	const distanceToCorner4 = Math.hypot(centerX - maxX, centerY - maxY);
  
	const radius = Math.max(distanceToCorner1, distanceToCorner2, distanceToCorner3, distanceToCorner4);
  
	return [centerX, centerY, radius];
  }

  export function generateLinearGradient(colors) {
	if (colors.length < 1) {
	  console.error('At least one color is required to create a gradient.');
	  return '';
	}
  
	if (colors.length === 1) {
	  // If there is only one color, create a gradient with the same color
	  return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`;
	}
  
	const numColors = colors.length;
	const interval = 100 / (numColors - 1);
  
	let gradient = 'linear-gradient(to right, ';
	colors.forEach((color, index) => {
	  gradient += `${color} ${index * interval}%, `;
	});
	
	// Remove the trailing comma and space, and add closing parenthesis
	gradient = gradient.slice(0, -2) + ')';
	
	return gradient;
  }


/** @public */
export class ConceptShapeUtil extends BaseBoxShapeUtil<ConceptShape> {
	static override type = 'concept' as const
	static override props = conceptShapeProps

	override canEdit = () => true

	override canResize = () => false


	getDefaultProps(): ConceptShape['props'] {
		return { 
			w: 100,
			h: 20,
			text: "",
			plainText: "",
			activated: false,
			temporary: false,
			colors: [conceptColors[Math.floor(Math.random() * conceptColors.length)]],
			description: "",
		}
	
	}

	getGeometry(shape: ConceptShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	component(shape: ConceptShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds
		const isSelected = shape.id === this.editor.getOnlySelectedShapeId();
		const shapeRef = useRef<HTMLDivElement>();
		const buffer = 2

		const editor = useEditor({
			extensions: [
			  OneLiner,
			  Paragraph,
			  Text,
			  Placeholder.configure({
				placeholder: "Unknown Concept"
			  })
			],
			content: shape.props.text,
		

			onUpdate: ({ editor }) => {
				stopEventPropagation;

				this.editor.updateShape<ConceptShape>({
					id: shape.id,
					type: 'concept',
					props: {
						text: editor.getJSON(),
						plainText: editor.getText(),
						w: (shapeRef.current?.clientWidth+buffer) || 100,
						h: (shapeRef.current?.clientHeight+buffer) || 20,
					}
				})
			},

			onSelectionUpdate: ({ editor }) => {
			}
		  });


		useLayoutEffect(()=>{
			if(editor && this.editor){
				this.editor.updateShape<ConceptShape>({
					id: shape.id,
					type: 'concept',
					props: {
						w: shapeRef.current.clientWidth+buffer,
						h: shapeRef.current.clientHeight+buffer,
					}
				})
			}
		  }, [this.editor, editor])

	

		return (
			<HTMLContainer 
				id={shape.id}
				style={{
					pointerEvents: 'none',
					// display: 'flex',
					// justifyContent: 'center',
					// alignItems: 'center',
					height: 'fit-content',
					width: 'fit-content',
					position: 'relative'
				}}
				>
				{shape.props.activated && <div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: "translate(-50%, -50%)",
					filter: "blur(40px)",
					backgroundImage: generateLinearGradient(shape.props.colors),
					borderRadius: '100%',
					width: shapeRef.current?.clientWidth-40 || '100px',
					height: shapeRef.current?.clientWidth-40 || '100px',
				}}/>}
				<div style={{
					minHeight: "100%",
					minWidth: '100%',
					width: '100%',
					height: '100%',
					boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
					pointerEvents: 'all',	
					display: 'flex',
					gap: '8px',
					alignItems: 'center',
					color: 'transparent'
				}}
				ref={shapeRef}
				>
					<div style={{
						borderRadius: '100%',
						backgroundImage: generateLinearGradient(shape.props.colors),
						height: "14px",
						width: '14px',
						flexShrink: 0,
					}}
					/>
					<EditorContent 
						editor={editor}
						onKeyDown={stopEventPropagation}
						className='tiptapConcept'
						style={{
							fontWeight: 550,
							backgroundImage: generateLinearGradient(shape.props.colors),
    						backgroundClip: "text",
							letterSpacing: '-0.00em',
							lineHeight: '21px',
							fontSize: '14px',
							whiteSpace: 'nowrap',
						}}
					/>
				</div>
			</HTMLContainer>
		)
	}


	indicator(shape: ConceptShape) {
		return <rect width={shape.props.w} height={shape.props.h} />

	}

	override onResize: TLOnResizeHandler<any> = (shape, info) => {
		return null
	}

	override onTranslateStart: TLOnTranslateStartHandler<ConceptShape> = (shape) => {
		console.log("TRANSLATION STARTED")
		// media is parent
		// tear down all generative areas
		const conceptParent: any = this.editor.getShapeParent(shape)
		
		// on a kinematic canvas
		if(conceptParent?.type === 'kinematicCanvas'){
			const canvasChildren: any = this.editor.getSortedChildIdsForParent(conceptParent).map(id => this.editor.getShape(id))

			if(shape.props.temporary){
				this.editor.updateShape({id: shape.id, type: shape.type, opacity: 1, props: { temporary: false }})
			}
			// deactivate all activated concepts and tear down all temporary concepts
			this.editor.updateShape({id: shape.id, type: 'concept', props: { activated: false }})
			for(let child of canvasChildren){
				if(child.type === 'concept' && child.props.activated){
					this.editor.updateShape({id: child.id, type: child.type, props: { activated: false }})
				}
				else if(child.type === 'concept' && child.props.temporary && !shape.props.temporary){
					console.log("DELETED:")
					this.editor.deleteShape(child)
				}
			}
		}

		if(conceptParent?.type === "media" || conceptParent?.type === 'worldModel'){
			console.log("HI!")
			const newShapeId = createShapeId();

			// get binding attributes from existing concept
			const conceptBinding: any = this.editor.getBindingsFromShape(shape, 'mediaConcept')[0]

			// if a binding doesn't exist, create it

			console.log("CONCEPT BINDING:", conceptBinding)

			if(!conceptBinding){
				console.log("CREATING BINDING!")
				this.editor.createBinding({
					type: 'mediaConcept',
					fromId: shape.id,
					toId: conceptParent.id,
					props: {
						proportionX: shape.x / conceptParent.props.w,
						proportionY: shape.y / conceptParent.props.h,
					}
				})
			}

			// create new concept with the same attributes
			this.editor.createShape({...shape, id: newShapeId, opacity: 0.5})
			this.editor.reparentShapes([newShapeId], conceptParent.id)

			this.editor.createBinding({
				type: 'mediaConcept',
				fromId: newShapeId,
				toId: conceptParent.id,
				props: {
					proportionX: shape.x / conceptParent.props.w,
					proportionY: shape.y / conceptParent.props.h,
				}
			})
		}
	}

	override onTranslateEnd: TLOnTranslateEndHandler<ConceptShape> = (shape) => {
		console.log("TRANSLATION ENDED")
		const conceptParent: any = this.editor.getShapeParent(shape)

		
// calculate distance to other shapes in the kinematic canvas and change styling if close enough (use bindings here)
		if(conceptParent?.type === 'kinematicCanvas'){
			// TODO: inelegant, refactor later
			const allCanvasChildren = this.editor.getSortedChildIdsForParent(conceptParent).map(id => this.editor.getShape(id))
			const canvasChildren: any = this.editor.getSortedChildIdsForParent(conceptParent).filter(id => id !== shape.id).map(id => this.editor.getShape(id))

			// this version preserves local positioning, unlike the shape object given in onTranslateEnd
			const concept: any = this.editor.getSortedChildIdsForParent(conceptParent).filter(id => id === shape.id).map(id => this.editor.getShape(id))[0]

			// // tear down all activated concepts to recalculate distances
			// this.editor.updateShape({id: concept.id, type: 'concept', props: { activated: false }})
			// for(let child of canvasChildren){
			// 	if(child.type === 'concept' && child.props.activated){
			// 		this.editor.updateShape({id: child.id, type: child.type, props: { activated: false }})
			// 	}
			// }

			console.log("CHILDREN:", this.editor.getSortedChildIdsForParent(conceptParent).map(id => this.editor.getShape(id)))

			const distanceThreshold = 50;

			function calculateCenter(shape){
				console.log("SHAPE POSITION:", shape)
				const shapeX = shape.x + (shape.props.w / 2);
				const shapeY = shape.y + (shape.props.h / 2);

				return [shapeX, shapeY]
			}

			const [conceptX, conceptY] = calculateCenter(concept)

			console.log("CONCEPT POSITION:", conceptX, conceptY)

			// find object with minimum distance
			const distances = canvasChildren.map(child => {
				return {shape: child, distance: Math.sqrt(Math.pow(conceptX - calculateCenter(child)[0], 2) + Math.pow(conceptY - calculateCenter(child)[1], 2))}
			})

			const minDistanceShape: any = distances.reduce((closest, current) => {
				return current.distance < closest.distance ? current : closest;
			}, distances[0])

			if(minDistanceShape && minDistanceShape.distance < distanceThreshold){
				console.log("DISTANCE THRESHOLD:", minDistanceShape)
				// update shape parameter
				this.editor.updateShapes([
					{...minDistanceShape.shape, props: {
						...minDistanceShape.shape.props,
						activated: true
					}},
					{...concept, props: {
						...concept.props,
						activated: true
					}},

				])

				const [encapCircleX, encapCircleY, encapCircleR] = getEncapsulatingCircle(concept, minDistanceShape.shape)

				console.log("CIRCLE DIMS", encapCircleX, encapCircleY)

				// convert circle coordinates to world space

				console.log("CONCEPT PARENT:", conceptParent)
				const worldEncapCircle = this.editor.getShapePageTransform(conceptParent.id).applyToPoint({x: encapCircleX, y: encapCircleY})
				
				function positionShapesOnCircle(centerX, centerY, radius, numShapes) {
					const positions = [];
					const angleStep = (2 * Math.PI) / numShapes;
				  
					for (let i = 0; i < numShapes; i++) {
					  const angle = i * angleStep;
					  const x = centerX + radius * Math.cos(angle);
					  const y = centerY + radius * Math.sin(angle);
					  positions.push({ x, y });
					} 
				  
					return positions;
				  }

				//   console.log("WORLD CIRCLE DIMS", worldEncapCircleX, worldEncapCircleY)

				// placeholder for database
				const conceptArray: any = [
					{
						props: {
							text: "concept one"
						} 
					},
					{
						props: {
							text: "concept two"
						}
					}, 
					{
						props: {
							text: "concept 3"
						}
					}
				]

				

				const positions = positionShapesOnCircle(worldEncapCircle.x, worldEncapCircle.y, encapCircleR+80, conceptArray.length)

				
				console.log("MIN DISTANCE SHAPE:", minDistanceShape)

				this.editor.updateShape({
					id: conceptParent.id,
					type: conceptParent.type,
					props: {
						mergedConcepts: [
							{name: concept.props.plainText, description: concept.description || "", colors: concept.props.colors}, 
							{name: minDistanceShape.shape.props.plainText, description: minDistanceShape.shape.props.description || "", colors: minDistanceShape.shape.props.colors}],
						mergedConceptsPositions: positions,
					}
				})
				  
				// generate and bind 3 provisional concepts based on this coordinate
				console.log("POSITIONS:", positions)

				// conceptArray.map((el, idx) => {
				// 	let shapeId = createShapeId()
				// 	this.editor.createShape({
				// 		id: shapeId,
				// 		type: "concept",
				// 		x: positions[idx].x, // convert to world space and convert from top left to center
				// 		y: positions[idx].y, // convert to world space and convert from top left to center
				// 		opacity: 0.5,
						
				// 		props: {
				// 			text: JSON.stringify(el.props.text),
				// 			temporary: true,
				// 			colors: [...new Set([...concept.props.colors, ...minDistanceShape.shape.props.colors])],
				// 		}
				// 	})
				// 	const shape = this.editor.getShape(shapeId)
				// 	this.editor.reparentShapes([shape], conceptParent.id)
				// })
			}

		}

		if(conceptParent?.type === 'media' || conceptParent?.type === 'worldModel'){
			// get all children of parent
			console.log("HELLO!")
			const mediaChildren: any = this.editor.getSortedChildIdsForParent(conceptParent).map(id => this.editor.getShape(id))

			for(let mediaChild of mediaChildren){
				if(mediaChild.type === 'concept' && (mediaChild.props.text === shape.props.text) && mediaChild.id !== shape.id){
					this.editor.deleteShape(mediaChild.id)
				}
			}

		// check if there's a binding. if so update. if not, create.	
			const bindings = this.editor.getBindingsFromShape(shape, 'mediaConcept')

			console.log("BINDINGS:", bindings)
			if(bindings && bindings.some(e => e.toId === conceptParent.id)){
				const mediaBinding = bindings.find(e => e.toId ===  conceptParent.id)
				const endShape = this.editor.getShape(shape)

				console.log("UPDATE BINDING", endShape.x / conceptParent.props.w, shape.y / conceptParent.props.h)

				this.editor.updateBinding({id: mediaBinding.id, type: mediaBinding.type, props: {
					proportionX: endShape.x / conceptParent.props.w,
					proportionY: endShape.y / conceptParent.props.h,
				}})
			}
			else{
				console.log("CREATING BINDING")
				const endShape = this.editor.getShape(shape)
				this.editor.createBinding({
					type: 'mediaConcept',
					fromId: endShape.id,
					toId: conceptParent.id,
					props: {
						proportionX: endShape.x / conceptParent.props.w,
						proportionY: endShape.y / conceptParent.props.h,
					}
				})
			}
		
		}
	}

}