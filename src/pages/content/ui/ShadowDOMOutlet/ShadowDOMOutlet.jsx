import React, { useEffect, useState, useMemo } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { useCustomReadability } from '../ScriptHelpers/useCustomReadability';
// import ShadowCanvas from "@pages/content/ui/ShadowDOMOutlet/ShadowCanvas/ShadowCanvas"
import ShadowCanvas from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/ShadowFishCanvas.jsx"
import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";

const ShadowDOMOutlet = () => {
    const article = useCustomReadability();
    const [parsedContent, setParsedContent] = useState({})
    const [textContent, setTextContent] = useState({})
    const { fishOrchestrator } = useFish();
    const [ripples, setRipples] = useState([]);


    useEffect(() => { 
        console.log("ARTICLE:", article);
    }, [article]);

    useEffect(() => {
        const shadowHost = document.getElementById('goals-extension-content-view-root');

        if (shadowHost) {
            const siblings = Array.from(document.body.children).filter(
                (child) => child !== shadowHost
            );

            siblings.forEach((sibling) => {
                sibling.style.filter = 'blur(20px)';
            });

            return () => {
                siblings.forEach((sibling) => {
                    sibling.style.filter = '';
                });
            };
        }
    }, []);

    // const CustomDiv = ({ children, ...props }) => <div {...props}>{children}</div>;
    // const CustomSpan = ({ children, ...props }) => <span {...props}>{children}</span>;
    // const CustomP = ({ children, ...props }) => <p style={styles.shadowDOMParagraph} {...props}>{children}</p>;
    // const CustomA = ({ children, ...props }) => <p style={styles.shadowDOMLink} {...props}>{children}</p>;

    // const tagToComponentMap = {
    //     div: CustomDiv,
    //     span: CustomSpan,
    //     p: CustomP,
    //     a: CustomA,
    // };

    // const processNode = (node) => {
    //     if (node.type === 'tag' && tagToComponentMap[node.name]) {
    //         const CustomComponent = tagToComponentMap[node.name];

    //         console.log("NODE:", node)

    //         return (
    //             <CustomComponent type={node.type} name={node.name} data={node.data} nodeAttrs={{...node.attribs}}>
    //                 {domToReact(node.children, { replace: processNode, trim: true })}
    //             </CustomComponent>
    //         );
    //     }
    //     return node;
    // };
    
    // useEffect(() => {
    //     if(article?.sanitizedContent){
    //         const parsed = parse(article.sanitizedContent, { trim: true, replace: processNode  });
    //         console.log("PARSED:", parsed)
    //         setParsedContent(parsed)
    //     }
    // }, [article]);


    const handleClick = (e) => {
        console.log("X/Y", e.clientX, e.clientY)
        const newRipple = { x: e.clientX, y: e.clientY };
        setRipples((prevRipples) => [...prevRipples, newRipple]);
        fishOrchestrator.emit('shadowDOMClick', { x: e.clientX, y: e.clientY });

        setTimeout(() => {
            setRipples((prevRipples) => prevRipples.slice(1));
        }, 500); // duration of the ripple effect
    };


    return (
        <div id="goals-extension-content-view-root" className="shadowDOMWrapper" style={styles.shadowDOMWrapper} onClick={handleClick}>
           <ShadowCanvas article={article}/>
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
    zIndex: 99999999999,
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
