import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';
import Draggable from 'react-draggable';

const FishAgent = forwardRef(({ aiData, promptType, x, y, fishType, onPositionChange }, ref) => {
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

    useEffect(() => {
        if (fishRef.current) {
          fishRef.current.style.transition = "left 1s, top 1s";
          fishRef.current.style.left = `${x}px`;
          fishRef.current.style.top = `${y}px`;
        }
      }, [x, y]);

    useImperativeHandle(ref, () => ({
        getPosition: () => {
            return { x, y };
        },
        setPosition: (newX, newY) => {
            if (fishRef.current) {
                fishRef.current.style.left = `${newX}px`;
                fishRef.current.style.top = `${newY}px`;
            }
        }
    }));

      

    return (
        <Draggable 
            onStop={(e, data) => {
                onPositionChange(data.x, data.y);
            }}>
            <div ref={fishRef} className='fish' style={{...AIWrapperStyle, left: x, top: y}}>
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
