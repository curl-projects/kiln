import { useState, useEffect, useRef } from 'react';

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
	RecordProps,
    T,
    TLBaseShape,
    TLDefaultColorStyle
} from 'tldraw'
import { FishHeading } from "./FishHeading"

import Firefly from './Firefly.jsx';

// import { cardShapeMigrations } from './card-shape-migrations'

export type FishShape = TLBaseShape<
	'fish',
	{
		w: number,
		h: number,
        personality: string,
		destination: any,
		currentAngle: number,
		pathPoints: any,
		rotateColor: any,
	}
>

export class FishShapeUtil extends ShapeUtil<FishShape> {
	static override type = 'fish' as const
	// [1]
	static override props: RecordProps<FishShape> = {
        w: T.number,
	    h: T.number,
        personality: T.string,
		destination: T.any, 
		currentAngle: T.number,
		pathPoints: T.any,
		rotateColor: T.any,
    }

	getDefaultProps(): FishShape['props'] {
		return {
			w: 300,
			h: 300,
            personality: 'helper',
			destination: undefined,
			currentAngle: 0,
			pathPoints: [],
			rotateColor: `${Math.floor(Math.random() * 360)}deg`
		}
	}
	override isAspectRatioLocked = (_shape: FishShape) => true
	override canResize = (_shape: FishShape) => false

    override hideSelectionBoundsFg = (_shape: FishShape) => {
		
		const worldModelBinding = this.editor.getBindingsFromShape(_shape, 'fishWorldModel')[0]
		const worldModel: any = worldModelBinding ? this.editor.getShape(worldModelBinding.toId) : undefined

		if(!worldModel || worldModel.viewMode === 'fish'){
			return false
		}
		else{
			return true
		}


	}
    override hideSelectionBoundsBg = (_shape: FishShape) => {
			const worldModelBinding = this.editor.getBindingsFromShape(_shape, 'fishWorldModel')[0]
		const worldModel: any = worldModelBinding ? this.editor.getShape(worldModelBinding.toId) : undefined

		if(!worldModel || worldModel.viewMode === 'fish'){
			return false
		}
		else{
			return true
		}
	}
    override hideResizeHandles = (_shape: FishShape) => true
    override hideRotateHandle = (_shape: FishShape) => true

	getGeometry(shape: FishShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	component(shape: FishShape) {
		const timeoutsRef = useRef([]);
		const [isMoving, setIsMoving] = useState(false)
		const fishSpriteRef: any = useRef()

		const amplitude = 50;
		const baseWavelength = 500;
		const amplitudeFactor = 0.1;
		const speedFactor = 2;
		const distanceFactor = 0.3;

		const worldModelBinding = this.editor.getBindingsFromShape(shape, 'fishWorldModel')[0]
		const worldModel: any = worldModelBinding ? this.editor.getShape(worldModelBinding.toId) : undefined
		const worldModelBounds = worldModel ? this.editor.getShapeGeometry(worldModel).bounds : undefined
	
		const findShortestRotationPath = (start, end) => {
			const shortestAngle = ((((end - start) % 360) + 540) % 360) - 180;
			return start + shortestAngle;
		};
	
		const calculatePathPoints = (beginning, destination, amplitudeFactor) => {
			const {x: startX, y: startY} = beginning
			const {x: endX, y: endY} = destination
			const deltaX = endX - startX;
			const deltaY = endY - startY;
			const totalDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
	
			const numPeriods = Math.floor(totalDistance / baseWavelength);
			const remainingDistance = totalDistance - numPeriods * baseWavelength;
			const finalWavelength = remainingDistance;
	
			const numPoints = Math.max(100, Math.floor(totalDistance / 10));
			const newPathPoints = [];
			let angle = Math.atan2(deltaY, deltaX);
	
			for (let i = 0; i <= numPoints; i++) {
				const progress = i / numPoints;
				const distanceTraveled = progress * totalDistance;
				const isLastPeriod = distanceTraveled > numPeriods * baseWavelength;
				const currentWavelength = isLastPeriod ? finalWavelength : baseWavelength;
				const currentAmplitude = isLastPeriod ? amplitude * amplitudeFactor : amplitude;
				const wavePosition = distanceTraveled % baseWavelength;
				const sinusoidalOffset = currentAmplitude * Math.sin((2 * Math.PI / currentWavelength) * wavePosition);
	
				const mainX = startX + progress * deltaX;
				const mainY = startY + progress * deltaY;
				const offsetX = sinusoidalOffset * Math.cos(angle + Math.PI / 2);
				const offsetY = sinusoidalOffset * Math.sin(angle + Math.PI / 2);
				const x = mainX + offsetX;
				const y = mainY + offsetY;
	
				newPathPoints.push({ x, y, angle: angle * 180 / Math.PI });
	
				if (i > 0) {
					const segmentDeltaX = x - newPathPoints[i - 1].x;
					const segmentDeltaY = y - newPathPoints[i - 1].y;
					const segmentAngle = Math.atan2(segmentDeltaY, segmentDeltaX) * 180 / Math.PI;
					newPathPoints[i - 1].angle = segmentAngle;
				}
			}
	
			return newPathPoints;
		};


		useEffect(()=>{
			if(shape.props.destination){
				const newPathPoints = calculatePathPoints({x: shape.x, y: shape.y}, shape.props.destination, amplitudeFactor);
				this.editor.updateShape({id: shape.id, type: shape.type, props: {
					pathPoints: newPathPoints
				}})
			}
			// when the destination changes, update the path points
		}, [shape.props.destination])

		const zoomLevel = this.editor.getZoomLevel();

		useEffect(()=>{
			if(fishSpriteRef.current){
				this.editor.updateShape({
					id: shape.id,
					type: shape.type,
					props: {
						w: fishSpriteRef.current.clientWidth,
						h: fishSpriteRef.current.clientHeight,
					}
				})
			}
	

		}, [zoomLevel])


		useEffect(() => {
			const speed = 15;
		
			// Clear previous timeouts if shape.props.pathPoints changes
			timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
			timeoutsRef.current = [];
		
			if (shape.props.pathPoints && shape.props.pathPoints.length !== 0) {
			  setIsMoving(true); // Set moving state to true
			  shape.props.pathPoints.forEach((currentPoint, index) => {
				const timeout = setTimeout(() => {
				  this.editor.animateShape({
					id: shape.id,
					type: shape.type,
					x: currentPoint.x,
					y: currentPoint.y,
					props: {
					  currentAngle: currentPoint.angle,
					},
				  }, {
					animation: {
					  duration: speed,
					  easing: (t) => t,
					},
				  });
				  if (index === shape.props.pathPoints.length - 1) {
					setIsMoving(false); // Set moving state to false after last animation
				  }
				}, index * speed);
				timeoutsRef.current.push(timeout);
			  });

			// //   const shortestFinalAngle = findShortestRotationPath(shape.props.pathPoints[-1].angle, 0);
			//   this.editor.animateShape({
			// 	id: shape.id,
			// 	type: shape.type,
			// 	props: {
			// 		currentAngle: 0,
			// 	}
			//   })

			}
		
			// Cleanup function to clear timeouts if the component unmounts
			return () => {
			  timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
			};
		  }, [shape.props.pathPoints, this.editor]);
		
		
		useEffect(()=>{
			console.log("IS MOVING", isMoving)
		}, [isMoving ])
		

		return (
			<>
			<HTMLContainer
				id={shape.id}
				
				style={{
					height: "fit-content",
                    width: 'fit-content',
					pointerEvents: 'all',
					transform: `scale(var(--tl-scale))`,
					transformOrigin: "top left",
				}}
			>
			<div 
			ref={fishSpriteRef}
			style={{
				height: '100%',
				width: '100%',
			}}>
               <Firefly 
			   	angle={shape.props.currentAngle} 
				worldModel={worldModel}
				worldModelBounds={worldModelBounds}
				scale={(worldModel && worldModel.props?.viewMode) === 'fish' ? 1 : 0.01}
				isMoving={isMoving}
				rotateColor={shape.props.rotateColor}
			   />
			   <div style={{
			   }}>
				{/* {worldModel &&
				<FishHeading 
					id={worldModel.id}
					name={worldModel.props.name}
			   		width={worldModelBounds.width}
					height={worldModelBounds.height}
					minimized={worldModel.minimized} 
				/>
				} */}
			   </div>
			</div>
			</HTMLContainer>
			 {shape.props.pathPoints.map((point, index) => (
				<div
					key={index}
					style={{
						position: 'fixed',
						width: '5px',
						zIndex: '2147483647',
						height: '5px',
						backgroundColor: 'red',
						borderRadius: '50%',
						opacity: 0.1,
						left: point.x,
						top: point.y,
						
					}}
				></div>
			))}
			</>
		)
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