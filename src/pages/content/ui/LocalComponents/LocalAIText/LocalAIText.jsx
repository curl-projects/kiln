import { useState, useEffect } from 'react';
import { useStreamAI } from '@pages/content/ui/ScriptHelpers/useStreamAI.jsx';
import Firefly from '@pages/content/ui/ScriptHelpers/Firefly.jsx';

export default function LocalAIText({ aiData, promptType }) {
    const [aiState, setAIState] = useState("Welcome");
    const AIMutation = useStreamAI();

    useEffect(() => {
        setAIState("");
        AIMutation.mutate({
            setterFunction: setAIState,
            data: { ...aiData },
            promptType: promptType || 'sayHello'
        });
    }, []);

    return (
        <div style={AIWrapperStyle}>
            <div style={AIIconWrapperStyle}>
                <Firefly />
            </div>
            <div style={AITextWrapperStyle}>
                <p style={AITextStyle}>
                    {aiState}
                </p>
            </div>
        </div>
    );
}

const AIWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
    paddingLeft: '24px'
};

const AIIconWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const AITextWrapperStyle = {
    // Add styles here if needed
};

const AITextStyle = {
    color: '#898E87',
    fontSize: '18px',
    letterSpacing: '-0.03em',
    fontWeight: 550,
    lineHeight: '24px',
    margin: '0'
};
