import React, { useState, useEffect } from 'react';

const Ripple = ({ x, y }) => {
    const [isRippling, setIsRippling] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setIsRippling(false), 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div
            style={{
                position: 'absolute',
                top: y,
                left: x,
                transform: 'translate(-50%, -50%)',
                width: isRippling ? 100 : 0,
                height: isRippling ? 100 : 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '50%',
                transition: 'width 0.5s, height 0.5s, opacity 0.5s',
                opacity: isRippling ? 1 : 0,
                pointerEvents: 'none',
                zIndex: 100000,
            }}
        />
    );
};

export default Ripple;
