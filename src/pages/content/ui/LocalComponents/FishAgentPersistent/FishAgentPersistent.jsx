import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';
import Draggable from 'react-draggable';

const FishAgent = forwardRef(({ index, aiData, promptType, transform, fishType, onPositionChange, fishHeadOffset, finalOrientationTarget }, ref) => {
    const { transformX, transformY } = transform;

    const [aiState, setAIState] = useState("Welcome");
    const AIMutation = useStreamAI();
    const fishRef = useRef(null);
    const fireflyRef = useRef(null);


    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [pathPoints, setPathPoints] = useState([]);
    const [currentAngle, setCurrentAngle] = useState(Math.atan2(transformY, transformX) * 180 / Math.PI);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 }); // Store the last position to calculate the distance
    const [isMoving, setIsMoving] = useState(false);

    const amplitude = 100;
    const baseWavelength = 400;
    const amplitudeFactor = 0.1;
    const speedFactor = 1;
    const distanceFactor = 0.3;

    // useEffect(() => {
    //     setAIState("");
    //     AIMutation.mutate({
    //         setterFunction: setAIState,
    //         data: { ...aiData, fishType: fishType },
    //         promptType: promptType || 'sayHello'
    //     });
    // }, []);

    useEffect(() => {
        if (transformX !== lastPosition.x || transformY !== lastPosition.y){
            const newPathPoints = calculatePathPoints(currentPosition.x, currentPosition.y, transformX, transformY, amplitudeFactor);
            setPathPoints(newPathPoints);
            setLastPosition({ x: transformX, y: transformY });
            setIsMoving(true);  // Set moving to true when new path points are calculated
        }
    }, [transform]);

    useEffect(() => {
        let animationFrameId;
        let startTime;
        let startAngle = currentAngle;

        const moveFish = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            if (pathPoints.length > 0) {
                const totalDistance = calculateTotalDistance(pathPoints);
                const dynamicDuration = totalDistance / distanceFactor;
                const progress = elapsed / (dynamicDuration / speedFactor);
                const currentPointIndex = Math.floor(progress * pathPoints.length);
                if (currentPointIndex < pathPoints.length) {
                    const nextPoint = pathPoints[currentPointIndex];
                    setCurrentPosition(nextPoint);
                    const nextAngle = nextPoint.angle;
                    const interpolatedAngle = lerpAngle(startAngle, nextAngle, 0.1);
                    setCurrentAngle(interpolatedAngle);
                    startAngle = interpolatedAngle;
                    animationFrameId = requestAnimationFrame(moveFish);
                } else {
                    const orientationTarget = finalOrientationTarget || { x: transformX, y: transformY };
                    const finalOrientationAngle = Math.atan2(orientationTarget.y - transformY, orientationTarget.x - transformX) * 180 / Math.PI;

                    const shortestFinalAngle = findShortestRotationPath(currentAngle, finalOrientationAngle);

                    if (fireflyRef.current) {
                        fireflyRef.current.style.transition = 'transform 0.5s ease-in-out';
                        setCurrentAngle(shortestFinalAngle);
                    }

                    setTimeout(() => {
                        if (fireflyRef.current) {
                            fireflyRef.current.style.transition = '';
                        }
                    }, 500);

                    setIsMoving(false); // Set moving to false when animation ends
                    cancelAnimationFrame(animationFrameId);
                }
            } else {
                setIsMoving(false); // Set moving to false if there are no path points
                cancelAnimationFrame(animationFrameId);
            }
        };

        if (pathPoints.length > 0) {
            animationFrameId = requestAnimationFrame(moveFish);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [pathPoints]);

    const calculatePathPoints = (startX, startY, endX, endY, amplitudeFactor) => {
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

    const lerpAngle = (start, end, t) => {
        const shortestAngle = ((((end - start) % 360) + 540) % 360) - 180;
        return start + shortestAngle * t;
    };

    const findShortestRotationPath = (start, end) => {
        const shortestAngle = ((((end - start) % 360) + 540) % 360) - 180;
        return start + shortestAngle;
    };

    const calculateTotalDistance = (points) => {
        let totalDistance = 0;
        for (let i = 1; i < points.length; i++) {
            const deltaX = points[i].x - points[i - 1].x;
            const deltaY = points[i].y - points[i - 1].y;
            totalDistance += Math.sqrt(deltaX ** 2 + deltaY ** 2);
        }
        return totalDistance;
    };


    return (
        <>
        <Draggable
            position={currentPosition}
            positionOffset={{ x: fishHeadOffset.x, y: fishHeadOffset.y}}
            onStart={()=>{
                fishRef.current.style.transition = "none";
            }}
            onStop={(e, data) => {
                setCurrentPosition({ x: data.x, y: data.y });
            }}
        >
            <div ref={fishRef} className='fish' style={{...AIWrapperStyle, left: 0, top: 0}}>
                <div className='innerFish' style={innerFishStyle}>
                    <Firefly 
                        fireflyRef={fireflyRef} 
                        angle={currentAngle} 
                        isMoving={isMoving}
                        aiState={aiState}
                        fishType={fishType}
                    />
                </div>

            </div>
        </Draggable>
        {pathPoints.map((point, index) => (
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
                    left: 0,
                    top: 0,
                    transform: `translate(${point.x}px, ${point.y}px)`,
                }}
            ></div>
        ))}
            <div style={{
                position: 'fixed',
                width: '10px',
                zIndex: '2147483647',
                height: '10px',
                backgroundColor: 'green',
                borderRadius: '50%',
                opacity: 0.1,
                left: 0,
                top: 0,
                transform: `translate(${transformX}px, ${transformY}px)`,
            }}>

            </div>
        </>
    );
})

export default FishAgent

const innerFishStyle = {
    height: '100%',
    width: '100%',
    position: 'relative',
}

const AIWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    position: 'fixed',
    height: 'fit-content',
    width: 'fit-content',
    cursor: 'grab',
    zIndex: 2147483647,
};


const AIIconWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0
};

const AITextWrapperStyle = {
    // Add styles here if needed
    background: 'white',
    padding: '10px',
    borderRadius: '10px',
    position: 'absolute',
    top: '50%', // Aligns middle of the div vertically
    left: '100%', // Positions it to the right of the fish
    transform: 'translateY(-50%)', // Centers it vertically

};

const AITextStyle = {
    color: '#7F847D',
    fontSize: '18px',
    letterSpacing: '-0.03em',
    fontWeight: 550,
    lineHeight: '24px',
    margin: '0'
};
