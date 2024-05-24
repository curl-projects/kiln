import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';
import Draggable from 'react-draggable';

const FishAgent = forwardRef(({ aiData, promptType, transformX, transformY, fishType, onPositionChange }, ref) => {
    const [aiState, setAIState] = useState("");
    const AIMutation = useStreamAI();
    const fishRef = useRef(null);
    const fireflyRef = useRef(null);

    const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
    const [pathPoints, setPathPoints] = useState([]);
    const [currentAngle, setCurrentAngle] = useState(Math.atan2(transformY, transformX) * 180 / Math.PI);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 }); // Store the last position to calculate the distance


    const numPoints = 10; // Number of intermediate points along the path
    const amplitude = 20; // Amplitude of the sinusoidal motion

    const calculatePathPoints = (startX, startY, endX, endY) => {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const totalDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const cycles = Math.max(1, Math.floor(totalDistance / 100)); // Calculate cycles based on distance

        const newPathPoints = [];
        let cumulativeAngle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        for (let i = 1; i <= numPoints; i++) {
            const progress = i / numPoints;
            const sinusoidalOffset = amplitude * Math.sin(2 * Math.PI * cycles * progress); // Dynamic frequency based on cycles
            const angle = Math.atan2(deltaY, deltaX);
            const perpendicularAngle = angle + Math.PI / 2;

            const mainX = startX + progress * deltaX;
            const mainY = startY + progress * deltaY;
            const offsetX = sinusoidalOffset * Math.cos(perpendicularAngle);
            const offsetY = sinusoidalOffset * Math.sin(perpendicularAngle);
            const x = mainX + offsetX;
            const y = mainY + offsetY;

            newPathPoints.push({ x, y, angle: cumulativeAngle });

            if (i > 1) {
                const segmentDeltaX = x - newPathPoints[i - 2].x;
                const segmentDeltaY = y - newPathPoints[i - 2].y;
                const segmentAngle = Math.atan2(segmentDeltaY, segmentDeltaX) * 180 / Math.PI;
                cumulativeAngle = segmentAngle;
            }
        }

        return newPathPoints;
    };

    useEffect(() => {
        if (transformX !== lastPosition.x || transformY !== lastPosition.y) {
            const newPathPoints = calculatePathPoints(currentPosition.x, currentPosition.y, transformX, transformY);
            setPathPoints(newPathPoints);
            setLastPosition({ x: transformX, y: transformY }); // Update last position to new target
        }
    }, [transformX, transformY]);

    useEffect(() => {
        let interval = setInterval(() => {
            if (pathPoints.length > 0) {
                const nextPoint = pathPoints.shift();
                setCurrentPosition(nextPoint);
                setCurrentAngle(nextPoint.angle); // Use the updated angle directly
                setPathPoints(pathPoints);
            } else {
                clearInterval(interval);
            }
        }, 100); // Smooth animation interval

        return () => clearInterval(interval);
    }, [pathPoints]);



    // useEffect(() => {
    //     setAIState("");
    //     AIMutation.mutate({
    //         setterFunction: setAIState,
    //         data: { ...aiData },
    //         promptType: promptType || 'sayHello'
    //     });
    // }, []);

    useEffect(()=>{
        console.log("CURRENT ANGLE::", currentAngle)
    }, [aiState])

    
    
    useEffect(() => {   
        if (fishRef.current) {
            fishRef.current.style.transition = "transform 1s";            
        }
        console.log("TRANSFORM X:", transformX)
        console.log("TRANSFORM Y:", transformY)
    }, [transformX, transformY]);


    return (
        <Draggable
            position={currentPosition}
            onStart={()=>{
                fishRef.current.style.transition = "none";
            }}
            
            // onDrag={(e, data)=>{
            //     onPositionChange(data.x, data.y)
            // }}
            onStop={(e, data) => {
                console.log("DATA:", data)
                onPositionChange(data.x, data.y)
                fishRef.current.style.transition = "transform 1s";
            }}
        >
            <div ref={fishRef} className='fish' style={{...AIWrapperStyle, left: 0, top: 0}}>
                <Firefly fireflyRef={fireflyRef} angle={currentAngle} />
                <div style={AITextWrapperStyle}>
                    <p style={AITextStyle}>
                        {aiState}
                    </p>
                </div>
            </div>
        </Draggable>
    );
})

export default FishAgent

const AIWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    paddingLeft: '24px',
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
