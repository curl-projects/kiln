import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';

const Ripple = forwardRef(({ delays = [200, 400, 600] }, ref) => {
  const [ripples, setRipples] = useState([]);

  useImperativeHandle(ref, () => ({
    triggerRipple: (x, y, width, height) => {
      delays.forEach((delay, i) => {
        setTimeout(() => {
          const newRipple = {
            x,
            y,
            width,
            height,
            id: Date.now() + i,
          };
          setRipples((prevRipples) => [...prevRipples, newRipple]);
        }, delay);
      });
    },
  }));

  useEffect(() => {
    if (ripples.length > 0) {
      const cleanup = setTimeout(() => {
        setRipples([]);
      }, Math.max(...delays)); // Ensuring cleanup after the last ripple animation ends
      return () => clearTimeout(cleanup);
    }
  }, [ripples, delays]);

  return (
    <>
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          style={{
            position: 'fixed',
            left: ripple.x,
            top: ripple.y,
            width: ripple.width,
            height: ripple.height,
            pointerEvents: 'none',
            zIndex: 2147483647,
            animation: 'fish-ripple 1s forwards',
          }}
          onAnimationEnd={() => setRipples((prevRipples) => prevRipples.filter((r) => r.id !== ripple.id))}
        >
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              border: '1px solid #FEAC85',
              animation: 'fish-ripple 1s forwards',
            }}
          />
        </div>
      ))}
    </>
  );
});

export default Ripple;
