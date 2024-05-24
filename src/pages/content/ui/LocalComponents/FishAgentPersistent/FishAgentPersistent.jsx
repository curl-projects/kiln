import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';
import Draggable from 'react-draggable';

const FishAgent = forwardRef(({ aiData, promptType, transform, fishType, onPositionChange, fishHeadOffset }, ref) => {
    const { transformX, transformY } = transform;

    const [aiState, setAIState] = useState("");
    const AIMutation = useStreamAI();
    const fishRef = useRef(null);
    const fireflyRef = useRef(null);


    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [pathPoints, setPathPoints] = useState([]);
    const [currentAngle, setCurrentAngle] = useState(Math.atan2(transformY, transformX) * 180 / Math.PI);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 }); // Store the last position to calculate the distance


    useEffect(()=>{
        console.log("TRANSFORM", transform)
    }, [transform])

    useEffect(()=>{
        console.log("LAST POSITION", lastPosition)
    }, [lastPosition])

    const amplitude = 100; // Amplitude of the sinusoidal motion
    const baseWavelength = 400; // Base wavelength of the sinusoidal motion
    const totalDuration = 2000; // Total duration of the animation in milliseconds
    const amplitudeFactor = 0.1; // Factor to control the amplitude of the last wave
    const speedFactor = 1; // Factor to control the speed of the animation

    useEffect(() => {
        if (transformX !== lastPosition.x || transformY !== lastPosition.y) {
            const newPathPoints = calculatePathPoints(currentPosition.x, currentPosition.y, transformX, transformY, amplitudeFactor);
            setPathPoints(newPathPoints);
            setLastPosition({ x: transformX, y: transformY });
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
                const progress = elapsed / (totalDuration / speedFactor);
                const currentPointIndex = Math.floor(progress * pathPoints.length);
                if (currentPointIndex < pathPoints.length) {
                    const nextPoint = pathPoints[currentPointIndex];
                    setCurrentPosition(nextPoint);
                    const nextAngle = nextPoint.angle;
                    const interpolatedAngle = lerp(startAngle, nextAngle, 0.1);
                    setCurrentAngle(interpolatedAngle);
                    startAngle = interpolatedAngle;
                    animationFrameId = requestAnimationFrame(moveFish);
                } else {
                    cancelAnimationFrame(animationFrameId);
                }
            } else {
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

        // Calculate the smallest number of periods before passing the target point
        const numPeriods = Math.floor(totalDistance / baseWavelength);
        const remainingDistance = totalDistance - numPeriods * baseWavelength;
        const finalWavelength = remainingDistance;

        const numPoints = Math.max(100, Math.floor(totalDistance / 10)); // Proportional to distance
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

    const lerp = (start, end, t) => {
        const shortestAngle = ((((end - start) % 360) + 540) % 360) - 180;
        return start + shortestAngle * t;
    };



    useEffect(()=>{
        console.log("CURRENT ANGLE::", currentAngle)
    }, [aiState])

    
    
    useEffect(() => {   
        // when movement starts, make sure that the fish is transitioning
        if (fishRef.current) {
        }
    }, [transform]);


    return (
        <>
        <Draggable
            position={currentPosition}
            positionOffset={{ x: fishHeadOffset.x, y: fishHeadOffset.y}}
            onStart={()=>{
                fishRef.current.style.transition = "none";
            }}
            onStop={(e, data) => {
                console.log("DATA:", data)
                onPositionChange(data.x, data.y)
            }}
        >
            <div ref={fishRef} className='fish' style={{...AIWrapperStyle, left: 0, top: 0}}>
                <Firefly 
                    fireflyRef={fireflyRef} 
                    angle={currentAngle} 
                />
                {/* <div style={AITextWrapperStyle}>
                    <p style={AITextStyle}>
                        {aiState}
                    </p>
                </div> */}
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
    border: '2px solid pink'
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
    borderRadius: '10px'
};

const AITextStyle = {
    color: '#7F847D',
    fontSize: '18px',
    letterSpacing: '-0.03em',
    fontWeight: 550,
    lineHeight: '24px',
    margin: '0'
};
