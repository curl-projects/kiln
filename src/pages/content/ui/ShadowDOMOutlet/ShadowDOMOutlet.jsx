import React, { useEffect, useState, useMemo } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { useCustomReadability } from '../ScriptHelpers/useCustomReadability';
// import ShadowCanvas from "@pages/content/ui/ShadowDOMOutlet/ShadowCanvas/ShadowCanvas"
import ShadowCanvas from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/ShadowFishCanvas.jsx"
import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";

const ShadowDOMOutlet = ({ shadowOpen, canvasMode}) => {
    // const article = useCustomReadability();
    // const [parsedContent, setParsedContent] = useState({})
    // const [textContent, setTextContent] = useState({})
    // const { fishOrchestrator } = useFish();
    // const [ripples, setRipples] = useState([]);

    return (
        <div 
          id="shadowDOMWrapper" 
          style={{
            ...styles.shadowDOMWrapper, 
            display: shadowOpen ? 'block' : 'none',
            zIndex: (shadowOpen && canvasMode === 'canvas') ? 21474836 : 0,
          }}>
           <ShadowCanvas 
        //    article={article}
           />
        </div>
    );
};

const styles = {
  shadowDOMWrapper: {
    height: '100vh',
    width: '100vw',
    color: "#898E87",
    boxSizing: 'border-box',
    position: 'fixed',
    top: 0,
    left: 0,
    border: '2px solid pink',
    zIndex: 0, // this needs to change contextually once i've figured out the flow
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: "20px",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // padding: '80px',
    overflow: 'scroll',
    fontFamily: 'Helvetica Neue, sans-serif',
  },
  shadowDOMParagraph: {
    fontSize: "14px",
    fontFamily: 'Helvetica Neue, sans-serif',
    fontWeight: 550,
    margin: 0,
    color: "#898E87"
  },
  shadowDOMLink: {
    fontSize: "14px",
    fontFamily: 'Helvetica Neue, sans-serif',
    fontWeight: 550,
    margin: 0,
    color: "#FEAC85",
  }
};

export default ShadowDOMOutlet;
