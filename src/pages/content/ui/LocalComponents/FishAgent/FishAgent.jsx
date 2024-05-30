import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';

const FishAgent = ({ aiData, promptType}) => {
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

    return (
        <div ref={fishRef} className='fish' style={{...AIWrapperStyle}}>
            <Firefly />
            <div style={AITextWrapperStyle}>
                <p style={AITextStyle}>
                    {aiState}
                </p>
            </div>
        </div>
    );
}

export default FishAgent

const AIWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    paddingLeft: '24px',
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
