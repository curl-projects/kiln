import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';
import Draggable from 'react-draggable';

const FishAgent = forwardRef(({ aiData, promptType, transformX, transformY, fishType, onPositionChange }, ref) => {
    const [aiState, setAIState] = useState("Welcome");
    const AIMutation = useStreamAI();
    const fishRef = useRef(null);

    useEffect(() => {
        setAIState("");
        AIMutation.mutate({
            setterFunction: setAIState,
            data: { ...aiData },
            promptType: promptType || 'sayHello'
        });
    }, []);

    useEffect(()=>{
        console.log("AI STATE:", aiState)
    }, [aiState])

    useEffect(() => {
        if (fishRef.current) {
            console.log("X", transformX)
            console.log("Y", transformY)
          fishRef.current.style.transition = "transform 1s";
        //   fishRef.current.style.left = `${x}px`;
        //   fishRef.current.style.top = `${y}px`;
        }
      }, [transformX, transformY]);
      

    return (
        <Draggable
            position={{x: transformX, y: transformY}}
            onStart={()=>{
                fishRef.current.style.transition = "none";
            }}

            onStop={(e, data) => {
                console.log("DATA:", data)
                onPositionChange(data.x, data.y)
                fishRef.current.style.transition = "transform 1s";
            }}
        >
            <div ref={fishRef} className='fish' style={{...AIWrapperStyle, left: 0, top: 0}}>
                <Firefly />
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
    height: '200px',
    width: '300px',
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
