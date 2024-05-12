import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { FaCog } from 'react-icons/fa';
import Draggable from 'react-draggable';
import PanelButton from './PanelButton/PanelButton';
import PanelLogic from "../PanelLogic/PanelLogic.jsx";

const POSITIONS = {
  bottom: { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  top: { top: 0, left: '50%', transform: 'translateX(-50%)' },
  left: { top: '50%', left: 0, transform: 'translateY(-50%)' },
  right: { top: '50%', right: 0, transform: 'translateY(-50%)' },
};

export default function BasePanel({ children, config, type, side = 'bottom', forceOpen = false }) {
  const [isCollapsed, setCollapsed] = useState(!forceOpen);
  const contentRef = useRef(null);
  const [springStyles, api] = useSpring(() => ({
    width: forceOpen ? 300 : 40,
    gridTemplateRows: forceOpen ? '1fr' : '0fr',
    config: { tension: 170, friction: 26 },
  }));

  useEffect(() => {
    if (forceOpen && isCollapsed) {
      setCollapsed(false);
      api.start({
        width: 300,
        gridTemplateRows: '1fr',
      });
    }
  }, [forceOpen, isCollapsed, api]);

  const handleMouseEnter = () => {
    if (!forceOpen) {
      setCollapsed(false);
      api.start({
        width: 300,
        gridTemplateRows: '1fr',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!forceOpen) {
      setCollapsed(true);
      api.start({
        width: 40,
        gridTemplateRows: '0fr',
      });
    }
  };

  const positionStyle = POSITIONS[side] || POSITIONS.bottom;

  return (
    <PanelLogic config={config} type={type}>
      <Draggable disabled={isCollapsed}>
        <animated.div
          style={{
            ...springStyles,
            ...basePanelStyle,
            ...positionStyle,
            display: 'grid',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={contentRef}
            style={{
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {isCollapsed && !forceOpen ? (
              <div
                style={{
                  width: '100%',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PanelButton type='localAI' />
              </div>
            ) : (
              children
            )}
          </div>
        </animated.div>
      </Draggable>
    </PanelLogic>
  );
}

const basePanelStyle = {
  border: '2px solid #EEEEEC',
  backgroundColor: '#FCFDFC',
  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
  minHeight: '40px',
  minWidth: '40px',
  zIndex: 10000000000,
  position: 'fixed',
  cursor: 'grab',
};