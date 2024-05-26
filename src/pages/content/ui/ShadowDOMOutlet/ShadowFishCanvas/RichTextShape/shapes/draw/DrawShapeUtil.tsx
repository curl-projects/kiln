/* eslint-disable react-hooks/rules-of-hooks */
import {
	Box,
	Circle2d,
	Polygon2d,
	Polyline2d,
	SVGContainer,
	ShapeUtil,
	SvgExportContext,
	TLDrawShape,
	TLDrawShapeSegment,
	TLOnResizeHandler,
	TLShapeUtilCanvasSvgDef,
	VecLike,
	drawShapeMigrations,
	drawShapeProps,
	last,
	rng,
	toFixed,
} from '@tldraw/editor'
import { ShapeFill, useDefaultColorTheme } from '../shared/ShapeFill'
import { STROKE_SIZES } from '../shared/default-shape-constants'
import { getFillDefForCanvas, getFillDefForExport } from '../shared/defaultStyleDefs'
import { getStrokePoints } from '../shared/freehand/getStrokePoints'
import { getSvgPathFromStrokePoints } from '../shared/freehand/svg'
import { svgInk } from '../shared/freehand/svgInk'
import { useForceSolid } from '../shared/useForceSolid'
import { getDrawShapeStrokeDashArray, getFreehandOptions, getPointsFromSegments } from './getPath'

/** @public */
export class DrawShapeUtil extends ShapeUtil<TLDrawShape> {
	static override type = 'draw' as const
	static override props = drawShapeProps
	static override migrations = drawShapeMigrations

	override hideResizeHandles = (shape: TLDrawShape) => getIsDot(shape)
	override hideRotateHandle = (shape: TLDrawShape) => getIsDot(shape)
	override hideSelectionBoundsFg = (shape: TLDrawShape) => getIsDot(shape)

	override getDefaultProps(): TLDrawShape['props'] {
		return {
			segments: [],
			color: 'black',
			fill: 'none',
			dash: 'draw',
			size: 'm',
			isComplete: false,
			isClosed: false,
			isPen: false,
		}
	}

	getGeometry(shape: TLDrawShape) {
		const points = getPointsFromSegments(shape.props.segments)
		const strokeWidth = STROKE_SIZES[shape.props.size]

		// A dot
		if (shape.props.segments.length === 1) {
			const box = Box.FromPoints(points)
			if (box.width < strokeWidth * 2 && box.height < strokeWidth * 2) {
				return new Circle2d({
					x: -strokeWidth,
					y: -strokeWidth,
					radius: strokeWidth,
					isFilled: true,
				})
			}
		}

		const strokePoints = getStrokePoints(
			points,
			getFreehandOptions(shape.props, strokeWidth, true, true)
		).map((p) => p.point)

		// A closed draw stroke
		if (shape.props.isClosed) {
			return new Polygon2d({
				points: strokePoints,
				isFilled: shape.props.fill !== 'none',
			})
		}

		// An open draw stroke
		return new Polyline2d({
			points: strokePoints,
		})
	}

	component(shape: TLDrawShape) {
		return (
			<SVGContainer id={shape.id}>
				<DrawShapeSvg shape={shape} forceSolid={useForceSolid()} />
			</SVGContainer>
		)
	}

	indicator(shape: TLDrawShape) {
		const forceSolid = useForceSolid()
		const strokeWidth = STROKE_SIZES[shape.props.size]
		const allPointsFromSegments = getPointsFromSegments(shape.props.segments)

		let sw = strokeWidth
		if (
			!forceSolid &&
			!shape.props.isPen &&
			shape.props.dash === 'draw' &&
			allPointsFromSegments.length === 1
		) {
			sw += rng(shape.id)() * (strokeWidth / 6)
		}

		const showAsComplete = shape.props.isComplete || last(shape.props.segments)?.type === 'straight'
		const options = getFreehandOptions(shape.props, sw, showAsComplete, true)
		const strokePoints = getStrokePoints(allPointsFromSegments, options)
		const solidStrokePath =
			strokePoints.length > 1
				? getSvgPathFromStrokePoints(strokePoints, shape.props.isClosed)
				: getDot(allPointsFromSegments[0], sw)

		return <path d={solidStrokePath} />
	}

	override toSvg(shape: TLDrawShape, ctx: SvgExportContext) {
		ctx.addExportDef(getFillDefForExport(shape.props.fill))
		return <DrawShapeSvg shape={shape} forceSolid={false} />
	}

	override getCanvasSvgDefs(): TLShapeUtilCanvasSvgDef[] {
		return [getFillDefForCanvas()]
	}

	override onResize: TLOnResizeHandler<TLDrawShape> = (shape, info) => {
		const { scaleX, scaleY } = info

		const newSegments: TLDrawShapeSegment[] = []

		for (const segment of shape.props.segments) {
			newSegments.push({
				...segment,
				points: segment.points.map(({ x, y, z }) => {
					return {
						x: toFixed(scaleX * x),
						y: toFixed(scaleY * y),
						z,
					}
				}),
			})
		}

		return {
			props: {
				segments: newSegments,
			},
		}
	}

	override expandSelectionOutlinePx(shape: TLDrawShape): number {
		const multiplier = shape.props.dash === 'draw' ? 1.6 : 1
		return (STROKE_SIZES[shape.props.size] * multiplier) / 2
	}
}

function getDot(point: VecLike, sw: number) {
	const r = (sw + 1) * 0.5
	return `M ${point.x} ${point.y} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${
		r * 2
	},0`
}

function getIsDot(shape: TLDrawShape) {
	return shape.props.segments.length === 1 && shape.props.segments[0].points.length < 2
}

function DrawShapeSvg({ shape, forceSolid }: { shape: TLDrawShape; forceSolid: boolean }) {
	const theme = useDefaultColorTheme()
	const strokeWidth = STROKE_SIZES[shape.props.size]
	const allPointsFromSegments = getPointsFromSegments(shape.props.segments)

	const showAsComplete = shape.props.isComplete || last(shape.props.segments)?.type === 'straight'

	let sw = strokeWidth
	if (
		!forceSolid &&
		!shape.props.isPen &&
		shape.props.dash === 'draw' &&
		allPointsFromSegments.length === 1
	) {
		sw += rng(shape.id)() * (strokeWidth / 6)
	}

	const options = getFreehandOptions(shape.props, sw, showAsComplete, forceSolid)

	if (!forceSolid && shape.props.dash === 'draw') {
		return (
			<>
				{shape.props.isClosed && shape.props.fill && allPointsFromSegments.length > 1 ? (
					<ShapeFill
						theme={theme}
						fill={shape.props.isClosed ? shape.props.fill : 'none'}
						color={shape.props.color}
						d={getSvgPathFromStrokePoints(
							getStrokePoints(allPointsFromSegments, options),
							shape.props.isClosed
						)}
					/>
				) : null}
				<path
					d={svgInk(allPointsFromSegments, options)}
					strokeLinecap="round"
					fill={theme[shape.props.color].solid}
				/>
			</>
		)
	}

	const strokePoints = getStrokePoints(allPointsFromSegments, options)
	const isDot = strokePoints.length < 2
	const solidStrokePath = isDot
		? getDot(allPointsFromSegments[0], 0)
		: getSvgPathFromStrokePoints(strokePoints, shape.props.isClosed)

	return (
		<>
			<ShapeFill
				theme={theme}
				color={shape.props.color}
				fill={isDot || shape.props.isClosed ? shape.props.fill : 'none'}
				d={solidStrokePath}
			/>
			<path
				d={solidStrokePath}
				strokeLinecap="round"
				fill={isDot ? theme[shape.props.color].solid : 'none'}
				stroke={theme[shape.props.color].solid}
				strokeWidth={strokeWidth}
				strokeDasharray={isDot ? 'none' : getDrawShapeStrokeDashArray(shape, strokeWidth)}
				strokeDashoffset="0"
			/>
		</>
	)
}
