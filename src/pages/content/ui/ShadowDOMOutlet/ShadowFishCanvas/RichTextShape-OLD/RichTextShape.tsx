// import { ShapeUtil, 
// 	useEditor, 
// 	Rectangle2d, 
// 	T, 
// 	toDomPrecision, 
// 	TextShapeUtil, 
// 	TLOnEditEndHandler,
// 	ShapeProps, 
// 	TLBaseShape, 
// 	TLTextShape,
// 	TLOnResizeHandler,
// 	Vec,
// 	Editor,

// } from 'tldraw';
// import { useCallback } from 'react';

// export type RichTextShape = TLBaseShape<
// 'richText', {
// 	width: number,
// 	height: number,
// 	autoSize: boolean,
// 	scale: number,
// 	text: string,
// 	size: number,
// }>


// export class RichTextShapeUtil extends ShapeUtil<RichTextShape> {
// 	static override type = 'richText' as const
// 	static override props: ShapeProps<RichTextShape> = {
// 		width: T.number,
// 		height: T.number,
// 		autoSize: T.boolean,
// 		scale: T.number,
// 		text: T.string,
// 		size: T.number,
// 	}

// 	override canEdit = () => true


// 	getDefaultProps(): RichTextShape['props']{
// 		return {
// 			width: 1,
// 			height: 1,
// 			scale: 1,
// 			autoSize: true,
// 			text: "",
// 			size: 14,
// 		}
	
// 	}

// 	getGeometry(shape: RichTextShape){
// 		const { width, height } = shape.props
// 		return new Rectangle2d({
// 			width: width,
// 			height: height,
// 			isFilled: true,
// 			isLabel: true,
// 		})
// 	}

// 	indicator(shape: RichTextShape) {
// 		const bounds = this.editor.getShapeGeometry(shape).bounds
// 		const editor = useEditor()
// 		if (shape.props.autoSize && editor.getEditingShapeId() === shape.id) return null
// 		return <rect width={toDomPrecision(bounds.width)} height={toDomPrecision(bounds.height)} />
// 	}



// 	component(shape: RichTextShape){

// 	}

// 	override onResize: TLOnResizeHandler<RichTextShape> = (shape, info) => {
// 		const { newPoint, initialBounds, initialShape, scaleX, handle } = info

// 		if (info.mode === 'scale_shape' || (handle !== 'right' && handle !== 'left')) {
// 			return {
// 				id: shape.id,
// 				type: shape.type,
// 				...resizeScaled(shape, info),
// 			}
// 		} else {
// 			const nextWidth = Math.max(1, Math.abs(initialBounds.width * scaleX))
// 			const { x, y } =
// 				scaleX < 0 ? Vec.Sub(newPoint, Vec.FromAngle(shape.rotation).mul(nextWidth)) : newPoint

// 			return {
// 				id: shape.id,
// 				type: shape.type,
// 				x,
// 				y,
// 				props: {
// 					w: nextWidth / initialShape.props.scale,
// 					autoSize: false,
// 				},
// 			}
// 		}
// 	}

// 	override onBeforeCreate = (shape: RichTextShape) => {
// 		// When a shape is created, center the text at the created point.

// 		// Only center if the shape is set to autosize.
// 		if (!shape.props.autoSize) return

// 		// Only center if the shape is empty when created.
// 		if (shape.props.text.trim()) return

// 		const { width, height } = shape.props
// 		const bounds =  { width, height }

// 		return {
// 			...shape,
// 			x: shape.x - bounds.width / 2,
// 			y: shape.y - bounds.height / 2,
// 		}
// 	}

// 	override onEditEnd: TLOnEditEndHandler<RichTextShape> = (shape) => {
// 		const {
// 			id,
// 			type,
// 			props: { text },
// 		} = shape

// 		const trimmedText = shape.props.text.trimEnd()

// 		if (trimmedText.length === 0) {
// 			this.editor.deleteShapes([shape.id])
// 		} else {
// 			if (trimmedText !== shape.props.text) {
// 				this.editor.updateShapes([
// 					{
// 						id,
// 						type,
// 						props: {
// 							text: text.trimEnd(),
// 						},
// 					},
// 				])
// 			}
// 		}
// 	}

// 	override onBeforeUpdate = (prev: RichTextShape, next: RichTextShape) => {
// 		if (!next.props.autoSize) return

// 		const styleDidChange =
// 			prev.props.size !== next.props.size ||
// 			(prev.props.scale !== 1 && next.props.scale === 1)

// 		const textDidChange = prev.props.text !== next.props.text

// 		// Only update position if either changed
// 		if (!styleDidChange && !textDidChange) return

// 		// Might return a cached value for the bounds

// 		// Will always be a fresh call to getTextSize
// 		const boundsB = getTextSize(this.editor, next.props)

// 		const wA = 0
// 		const hA = 0
// 		const wB = boundsB.width * next.props.scale
// 		const hB = boundsB.height * next.props.scale

// 		let delta: Vec | undefined

// 		if (delta) {
// 			// account for shape rotation when writing text:
// 			delta.rot(next.rotation)
// 			const { x, y } = next
// 			return {
// 				...next,
// 				x: x - delta.x,
// 				y: y - delta.y,
// 				props: { ...next.props, w: wB },
// 			}
// 		} else {
// 			return {
// 				...next,
// 				props: { ...next.props, w: wB },
// 			}
// 		}
// 	}







	
// }


// // HELPER FUNCTIONS
// import { Box, TLShape, VecModel } from '@tldraw/editor'

// export function resizeScaled(
// 	shape: Extract<RichTextShape, { props: { scale: number } }>,
// 	{
// 		initialBounds,
// 		scaleX,
// 		scaleY,
// 		newPoint,
// 	}: {
// 		newPoint: VecModel
// 		initialBounds: Box
// 		scaleX: number
// 		scaleY: number
// 	}
// ) {
// 	// Compute the new scale (to apply to the scale prop)
// 	const scaleDelta = Math.max(0.01, Math.min(Math.abs(scaleX), Math.abs(scaleY)))

// 	// Compute the offset (if flipped X or flipped Y)
// 	const offset = new Vec(0, 0)

// 	if (scaleX < 0) {
// 		offset.x = -(initialBounds.width * scaleDelta)
// 	}
// 	if (scaleY < 0) {
// 		offset.y = -(initialBounds.height * scaleDelta)
// 	}

// 	// Apply the offset to the new point
// 	const { x, y } = Vec.Add(newPoint, offset.rot(shape.rotation))

// 	return {
// 		x,
// 		y,
// 		props: {
// 			scale: scaleDelta * shape.props.scale,
// 		},
// 	}
// }

// function getTextSize(editor: Editor, props: TLTextShape['props']) {
// 	const { font, text, autoSize, size, w } = props

// 	const minWidth = autoSize ? 16 : Math.max(16, w)
// 	const fontSize = FONT_SIZES[size]

// 	const cw = autoSize
// 		? null
// 		: // `measureText` floors the number so we need to do the same here to avoid issues.
// 			Math.floor(Math.max(minWidth, w))

// 	const result = editor.textMeasure.measureText(text, {
// 		...TEXT_PROPS,
// 		fontFamily: FONT_FAMILIES[font],
// 		fontSize: fontSize,
// 		maxWidth: cw,
// 	})

// 	// // If we're autosizing the measureText will essentially `Math.floor`
// 	// // the numbers so `19` rather than `19.3`, this means we must +1 to
// 	// // whatever we get to avoid wrapping.
// 	if (autoSize) {
// 		result.w += 1
// 	}

// 	return {
// 		width: Math.max(minWidth, result.w),
// 		height: Math.max(fontSize, result.h),
// 	}
// }

// function useTextShapeKeydownHandler(id: RichTextShape) {
// 	const editor = useEditor()

// 	return useCallback(
// 		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
// 			if (editor.getEditingShapeId() !== id) return

// 			switch (e.key) {
// 				case 'Enter': {
// 					if (e.ctrlKey || e.metaKey) {
// 						editor.complete()
// 					}
// 					break
// 				}
// 				case 'Tab': {
// 					preventDefault(e)
// 					if (e.shiftKey) {
// 						TextHelpers.unindent(e.currentTarget)
// 					} else {
// 						TextHelpers.indent(e.currentTarget)
// 					}
// 					break
// 				}
// 			}
// 		},
// 		[editor, id]
// 	)
// }