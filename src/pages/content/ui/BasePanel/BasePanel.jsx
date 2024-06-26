
import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useMeasure } from 'react-use';
import { FaUndo, FaThumbtack } from 'react-icons/fa';
import Draggable from 'react-draggable';
import PanelButton from './PanelButton/PanelButton';
import PanelLogic from '../PanelLogic/PanelLogic.jsx';

export default function BasePanel({ children, config, type, edge = 'bottom', position = 50, initialForceOpen = false }) {
  const [isCollapsed, setCollapsed] = useState(!initialForceOpen);
  const [forceOpen, setForceOpen] = useState(initialForceOpen);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const draggableRef = useRef(null);

  const defaultHeight = '40px';
  const defaultWidth = '40px';

  const [ref, { height, width }] = useMeasure();

  const [springStyles, animate] = useSpring(() => ({
    height: isCollapsed ? defaultHeight : `${height}px`,
    width: isCollapsed ? defaultWidth : `${width}px`,
    config: { tension: 170, friction: 26 },
  }), [isCollapsed, height, width]);

//   useEffect(()=>{
//     console.log("WIDTH:", width)
//     console.log("HEIGHT:", height)
//   }, [width, height])

  useEffect(() => {
    animate.start({
      height: isCollapsed ? defaultHeight : `${height}px`,
      width: isCollapsed ? defaultWidth : `${width}px`,
    });
  }, [animate, isCollapsed, height, width]);

//   useEffect(() => {
//     if (height > 0) {
//       setContentHeight(height);
//     }
//     if (width > 0) {
//       setContentWidth(width);
//     }
//   }, [height, width]);

  const handleResetPosition = () => {
    if (draggableRef.current) {
      draggableRef.current.setState({ x: initialPosition.x, y: initialPosition.y });
    }
  };

  const positionStyle = {
    position: 'fixed',
    [edge]: 0,
    ...(edge === 'top' || edge === 'bottom'
      ? { 
          left: `${position}%`,
          transform: 'translateX(-50%)',
        }
      : {
          top: `${position}%`,
          transform: 'translateY(-50%)',
        }),
  };

  return (
    <PanelLogic config={config} type={type}>
      <Draggable
        ref={draggableRef}
        disabled={isCollapsed}
        defaultPosition={initialPosition}
        onStart={() => setInitialPosition({ x: draggableRef.current.state.x, y: draggableRef.current.state.y })}
        handle=".goalsExtensionPanelHandle"
        
      >
        <animated.div
          style={{
            ...springStyles,
            ...styles.basePanelStyle,
            ...positionStyle,
          }}
          onMouseEnter={() => {!forceOpen && setCollapsed(false)}}
          onMouseLeave={() => {!forceOpen && setCollapsed(true)}}
        >
          <div
            className='basePanelWrapperDiv'
            ref={ref}
            style={{
              overflow: 'hidden',
              minHeight: '0px',
              minWidth: '0px',
              width: 'fit-content',
              height: 'fit-content',
              display: "grid",
            }}
          >
            {!isCollapsed
            
            ? (
            <>
                <div className='controlsRow' style={styles.controlsRow}> 
                <div style={{flex: 1}} className='goalsExtensionPanelHandle'/>
                <button
                    className="reset-button"
                    style={styles.controlButton}
                    onClick={handleResetPosition}
                >
                    <FaUndo />
                </button>
                <button
                    className="force-open-button"
                    style={{
                    ...styles.controlButton,
                    color: forceOpen ? '#FEAD82' : '#7F847D'
                    }}
                    onClick={() => setForceOpen(!forceOpen)}
                >
                    <FaThumbtack />
                </button>
                </div>
                <div className='goalsExtensionPanelHandle' style={{display: 'contents'}}>
                    {children}
                </div>
            </>
            )
            : (
            <div
                className="goalsExtensionPanelHandle"
                style={{
                  width: '100%',
                  height: '40px',
                  display: isCollapsed ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PanelButton type={type} />
              </div>
            )}
          </div>
        </animated.div>
      </Draggable>
    </PanelLogic>
  );
}

const styles = {
  basePanelStyle: {
    border: '2px solid #EEEEEC',
    backgroundColor: '#FCFDFC',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
    minHeight: '40px',
    minWidth: '40px',
    zIndex: 10000000000,
    cursor: 'grab',
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  controlsRow: {
    display: "flex",
    gap: "10px",
    paddingRight: "10px",
    paddingTop: "6px",
    paddingBottom: '6px',
  },
  controlButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    color: "#7F847D",
  }
};
