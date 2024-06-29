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

import { useCallback, useState, useEffect } from 'react'
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
export const kinematicCanvasModelShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	name: T.string,
}

export type RecordPropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
	[K in keyof Config]: T.TypeOf<Config[K]>
}>

export type KinematicCanvasShapeProps = RecordPropsType<typeof kinematicCanvasModelShapeProps>

/** @public */
export type KinematicCanvasModelShape = TLBaseShape<'kinematicCanvas', KinematicCanvasShapeProps>



/** @public */
export class KinematicCanvasShapeUtil extends BaseBoxShapeUtil<KinematicCanvasModelShape> {
	static override type = 'kinematicCanvas' as const
	static override props = kinematicCanvasModelShapeProps
	static override migrations = frameShapeMigrations

	override canEdit = (shape) => {
		return false
	}

	override canBind(){
		return true
	}

	override canCrop = () => true

	override getDefaultProps(): KinematicCanvasModelShape['props'] {
		return { w: 160 * 2, h: 90 * 2, name: '',}
	}

	override getGeometry(shape: KinematicCanvasModelShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: false,
		})
	}

	override component(shape: KinematicCanvasModelShape) {
		const [selectedOutput, setSelectedOutput] = useState(null);

		const bounds = this.editor.getShapeGeometry(shape).bounds

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const isCreating = useValue(
			'is creating this shape',
			() => {
				const resizingState = this.editor.getStateDescendant('select.resizing')
				if (!resizingState) return false
				if (!resizingState.getIsActive()) return false
				const info = (resizingState as typeof resizingState & { info: { isCreating: boolean } })
					?.info
				if (!info) return false
				return info.isCreating && this.editor.getOnlySelectedShapeId() === shape.id
			},
			[shape.id]
		)

		const selectedShapes = this.editor.getSelectedShapeIds();

		const frameIsAncestor = selectedShapes.some(selectedShape => this.editor.hasAncestor(selectedShape, shape.id))
		const frameIsSelected = selectedShapes.includes(shape.id)
	
		return (
			<HTMLContainer 
				style={{position: 'relative', boxSizing: 'border-box'}} 
				onPointerDown={stopEventPropagation}>
				<SVGContainer>
					<defs>
						<filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
						<feDropShadow dx="0" dy="36" stdDeviation="21" floodColor="#4D4D4D" floodOpacity="0.15"/>
						</filter>
					</defs>
					<rect
						className={classNames('tl-frame__body', { 'tl-frame__creating': isCreating })}
						width={bounds.width}
						height={bounds.height}
						rx="12"
						ry="12"
						fill="#F9F9F8"
						strokeWidth="1"
						stroke="#DDDDDA"
						filter="url(#boxShadow)"

					/>
				</SVGContainer>
			</HTMLContainer>
		)
	}

	indicator(shape: KinematicCanvasModelShape) {
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

	override canReceiveNewChildrenOfType = (shape: TLShape, _type: TLShape['type']) => {
		return !shape.isLocked
	}

	override providesBackgroundForChildren(): boolean {
		return true
	}

	override canDropShapes = (shape: KinematicCanvasModelShape, _shapes: TLShape[]): boolean => {
		return !shape.isLocked
	}

	override onDragShapesOver = (frame: KinematicCanvasModelShape, shapes: TLShape[]) => {
		if (!shapes.every((child) => child.parentId === frame.id)) {
			this.editor.reparentShapes(shapes, frame.id)
		}
	}

	override onDragShapesOut = (_shape: KinematicCanvasModelShape, shapes: TLShape[]): void => {
		const parent = this.editor.getShape(_shape.parentId)
		const isInGroup = parent && this.editor.isShapeOfType<TLGroupShape>(parent, 'group')

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
}