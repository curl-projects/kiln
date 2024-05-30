import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// const AIIconWrapperStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'absolute',
//     top: 0,
//     left: 0
// };



const outerAITextWrapperStyle = {
    position: 'absolute',
    left: '100%', // Positions it to the right of the fish
    // transform: 'translateY(-50%)', // Centers it vertically
}

const AITextWrapperStyle = {
    // Add styles here if needed
    background: 'white',
    padding: '10px',
    borderRadius: '10px',
    height: '100%',
    maxHeight: '300px',
    overflow: 'scroll',
    width: '160px',
};

const AITextNameWrapperStyle = {
    display: 'flex',
    alignItems: 'flex-start'
}
const AITextNameStyle = {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: '-0.01em',
    margin: 0,
    textTransform: "uppercase",
}


const AITextStyle = {
    color: '#7F847D',
    fontSize: '18px',
    letterSpacing: '-0.03em',
    fontWeight: 550,
    lineHeight: '24px',
    margin: '0',
    userSelect: "none",
};

const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.5 }},
    exit: { opacity: 0, scale: 0.8 }
};


const getVerticalTranslation = (angle) => {
    const radians = angle * (Math.PI / 180);
    return 50 * Math.sin(radians);
};


export default function Firefly({ angle, fireflyRef, isMoving, aiState, fishType, transform }) {
    const [boxDimensions, setBoxDimensions] = useState({ width: 0, height: 0 });
    const textBoxRef = useRef(null);

    useEffect(() => {
        if (textBoxRef.current) {
            const { offsetWidth, offsetHeight } = textBoxRef.current;
            setBoxDimensions({ width: offsetWidth, height: offsetHeight });
        }
    }, [aiState, isMoving]);

    
    useEffect(() => {
        console.log("IS MOVING:", isMoving);
    }, [isMoving]);

    const svgRef = useRef(null);

    useEffect(() => {
        const svgElement = svgRef.current;
        if (!svgElement) return;
    
        if (isMoving) {
            svgElement.classList.remove('slowMoving');
            svgElement.classList.add('moving');
        } else {
            svgElement.classList.remove('moving');
            svgElement.classList.add('slowMoving');
        }
    }, [isMoving]);
    

    const hueMap = {
        'optimist': '90deg', // green
        'critic': '270deg', // pink
        'researcher': '180deg', // blue
        'planner': '0deg', // orange
    }

    const colorMap = {
        'optimist': '#6BC076', // green
        'critic': '#E295DE', // pink
        'researcher': '#6BB8DD', // blue
        'planner': '#E6A07A', // orange
    }

    return (
        <div ref={fireflyRef} style={{ height: '65px', width: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${angle}deg)`}}>
            <div style={{...outerAITextWrapperStyle, transform: `rotate(${-angle}deg) translateY(${-getVerticalTranslation(angle)}px)`}}>
                <AnimatePresence>
                    {!isMoving && (
                        <motion.div
                            style={{ ...AITextWrapperStyle}}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={variants}
                            transition={{
                                hidden: { duration: 0.3 },
                                visible: { duration: 0.3 },
                                exit: { duration: 0.3 }
                            }}>
                            <div style={AITextNameWrapperStyle}>
                                <p style={{...AITextNameStyle, color: colorMap[fishType]}}>
                                    {
                                        {
                                        'optimist': 'The Optimist', // green
                                        'critic': 'The Critic', // pink
                                        'researcher': 'The Researcher', // blue
                                        'planner': 'The Planner', // orange
                                        }[fishType]
                                    }
                                </p> 
                            </div>
                            <p style={AITextStyle}>
                                {aiState}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <svg ref={svgRef} style={{ filter: `hue-rotate(${hueMap[fishType] || '0deg'}` }} width="65" height="42" viewBox="0 0 65 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* <path className="animated-path" d="M 0 21 L 65 21" stroke="#FBF7F5" stroke-width="1.77348"/> */}
                <g opacity="0.05" filter="url(#filter0_f_177_76)">
                    <circle cx="44.8545" cy="20.3702" r="15.3702" fill="#FBF7F5" />
                </g>
                <g filter="url(#filter1_f_177_76)">
                    <circle cx="44.857" cy="20.3706" r="7.68508" fill="#FBF7F5" />
                </g>
                <circle cx="44.8543" cy="20.3699" r="6.50276" fill="#FBF7F5" />
                <g opacity="0.2" filter="url(#filter2_f_177_76)">
                    <path d="M44.8597 32.4889C52.1426 32.4889 58.1608 26.9915 58.1608 20.0745C58.1608 13.1575 52.1426 7.66013 44.8597 7.66013C37.5767 7.66013 31.5586 13.1575 31.5586 20.0745C31.5586 26.9915 37.5767 32.4889 44.8597 32.4889Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter3_f_177_76)">
                    <path d="M44.8564 32.4889C52.1394 32.4889 58.1575 26.9915 58.1575 20.0745C58.1575 13.1575 52.1394 7.66013 44.8564 7.66013C41.3307 7.66013 31.2799 8.96697 22.1359 11.0588C17.5584 12.106 13.1521 13.3621 9.87338 14.7729C8.2385 15.4763 6.83461 16.2388 5.82493 17.065C4.83731 17.8732 4.06638 18.877 4.06638 20.0745C4.06638 21.272 4.83731 22.2758 5.82493 23.084C6.83461 23.9102 8.2385 24.6727 9.87338 25.3761C13.1521 26.7869 17.5584 28.043 22.1359 29.0902C31.2799 31.182 41.3307 32.4889 44.8564 32.4889Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter4_f_177_76)">
                    <path d="M57.2735 19.9865C57.2735 26.3073 51.7154 31.4314 44.8591 31.4314C38.0029 31.4314 2 14.8627 2 8.54185C2 2.22098 38.0029 8.54153 44.8591 8.54153C51.7154 8.54153 57.2735 13.6656 57.2735 19.9865Z" fill="#FEAD82" />
                    <path d="M44.8591 32.3182C52.1359 32.3182 58.1602 26.8636 58.1602 19.9865C58.1602 13.1094 52.1359 7.65479 44.8591 7.65479C43.2095 7.65479 39.7417 7.26909 35.3702 6.77166C35.1945 6.75167 35.0175 6.73151 34.8392 6.71122C30.6168 6.23045 25.6754 5.66782 20.9293 5.28746C15.9939 4.89192 11.2175 4.6887 7.65739 4.99164C5.88781 5.14221 4.33961 5.42332 3.20802 5.91333C2.08878 6.398 1.11326 7.22014 1.11326 8.54185C1.11326 9.14315 1.32495 9.73111 1.63441 10.2775C1.94638 10.8284 2.38656 11.388 2.9153 11.9486C3.97212 13.0691 5.46011 14.2744 7.22343 15.511C10.7561 17.9884 15.5137 20.6743 20.4617 23.15C25.4139 25.6278 30.5842 27.9087 34.9544 29.5725C37.1389 30.4042 39.1335 31.0855 40.807 31.5602C42.4564 32.0281 43.8702 32.3182 44.8591 32.3182Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter5_f_177_76)">
                    <path d="M56.9818 20.3699C56.9818 26.8996 51.4534 32.1929 44.6338 32.1929C37.8142 32.1929 2.89062 38.7226 2.89062 32.1929C2.89062 25.6632 37.8142 8.54688 44.6338 8.54688C51.4534 8.54688 56.9818 13.8402 56.9818 20.3699Z" fill="#FEAD82" />
                    <path d="M44.6338 33.0797C51.9064 33.0797 57.8685 27.4252 57.8685 20.3699C57.8685 13.3146 51.9064 7.66013 44.6338 7.66013C43.6431 7.66013 42.2458 7.96173 40.6281 8.44554C38.9858 8.93671 37.0349 9.64131 34.9028 10.5009C30.6374 12.2206 25.6043 14.5779 20.7886 17.1383C15.9769 19.6966 11.3548 22.4723 7.92364 25.0329C6.21074 26.3112 4.76617 27.5568 3.74083 28.7141C2.75216 29.8301 2.00388 31.0273 2.00388 32.1929C2.00388 33.51 2.92121 34.3603 4.03333 34.8729C5.14083 35.3835 6.65273 35.6749 8.37403 35.8307C11.8373 36.1443 16.4817 35.9338 21.2801 35.5251C25.8589 35.1351 30.6289 34.5598 34.7247 34.0658C34.9317 34.0408 35.137 34.016 35.3405 33.9915C39.6067 33.4774 42.997 33.0797 44.6338 33.0797Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.05" filter="url(#filter6_f_177_76)">
                    <circle cx="44.8545" cy="21.5518" r="15.3702" fill="#FBF7F5" />
                </g>
                <g filter="url(#filter7_f_177_76)">
                    <circle cx="44.857" cy="21.5523" r="7.68508" fill="#FBF7F5" />
                </g>
                <circle cx="44.8543" cy="21.5516" r="6.50276" fill="#FBF7F5" />
                <g opacity="0.2" filter="url(#filter8_f_177_76)">
                    <path d="M44.8597 33.6705C52.1426 33.6705 58.1608 28.1731 58.1608 21.2561C58.1608 14.3391 52.1426 8.84178 44.8597 8.84178C37.5767 8.84178 31.5586 14.3391 31.5586 21.2561C31.5586 28.1731 37.5767 33.6705 44.8597 33.6705Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter9_f_177_76)">
                    <path d="M44.8564 33.6705C52.1394 33.6705 58.1575 28.1731 58.1575 21.2561C58.1575 14.3391 52.1394 8.84178 44.8564 8.84178C41.3307 8.84178 31.2799 10.1486 22.1359 12.2405C17.5584 13.2877 13.1521 14.5438 9.87338 15.9545C8.2385 16.658 6.83461 17.4204 5.82493 18.2467C4.83731 19.0549 4.06638 20.0587 4.06638 21.2561C4.06638 22.4536 4.83731 23.4574 5.82493 24.2656C6.83461 25.0919 8.2385 25.8543 9.87338 26.5578C13.1521 27.9685 17.5584 29.2246 22.1359 30.2718C31.2799 32.3637 41.3307 33.6705 44.8564 33.6705Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter10_f_177_76)">
                    <path d="M57.2735 21.1681C57.2735 27.489 51.7154 32.6131 44.8591 32.6131C38.0029 32.6131 2 16.0444 2 9.72349C2 3.40262 38.0029 9.72317 44.8591 9.72317C51.7154 9.72317 57.2735 14.8472 57.2735 21.1681Z" fill="#FEAD82" />
                    <path d="M44.8591 33.4998C52.1359 33.4998 58.1602 28.0452 58.1602 21.1681C58.1602 14.291 52.1359 8.83643 44.8591 8.83643C43.2095 8.83643 39.7417 8.45074 35.3702 7.9533C35.1945 7.93331 35.0175 7.91316 34.8392 7.89286C30.6168 7.41209 25.6754 6.84946 20.9293 6.4691C15.9939 6.07356 11.2175 5.87035 7.65739 6.17328C5.88781 6.32385 4.33961 6.60496 3.20802 7.09497C2.08878 7.57964 1.11326 8.40178 1.11326 9.72349C1.11326 10.3248 1.32495 10.9127 1.63441 11.4592C1.94638 12.01 2.38656 12.5696 2.9153 13.1302C3.97212 14.2507 5.46011 15.456 7.22343 16.6926C10.7561 19.17 15.5137 21.8559 20.4617 24.3316C25.4139 26.8094 30.5842 29.0904 34.9544 30.7541C37.1389 31.5858 39.1335 32.2671 40.807 32.7419C42.4564 33.2097 43.8702 33.4998 44.8591 33.4998Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter11_f_177_76)">
                    <path d="M56.9818 21.5515C56.9818 28.0812 51.4534 33.3746 44.6338 33.3746C37.8142 33.3746 2.89062 39.9042 2.89062 33.3746C2.89062 26.8449 37.8142 9.72852 44.6338 9.72852C51.4534 9.72852 56.9818 15.0219 56.9818 21.5515Z" fill="#FEAD82" />
                    <path d="M44.6338 34.2613C51.9064 34.2613 57.8685 28.6068 57.8685 21.5515C57.8685 14.4962 51.9064 8.84178 44.6338 8.84178C43.6431 8.84178 42.2458 9.14337 40.6281 9.62718C38.9858 10.1183 37.0349 10.8229 34.9028 11.6826C30.6374 13.4023 25.6043 15.7595 20.7886 18.32C15.9769 20.8782 11.3548 23.6539 7.92364 26.2145C6.21074 27.4928 4.76617 28.7384 3.74083 29.8958C2.75216 31.0117 2.00388 32.2089 2.00388 33.3746C2.00388 34.6916 2.92121 35.5419 4.03333 36.0546C5.14083 36.5651 6.65273 36.8565 8.37403 37.0124C11.8373 37.3259 16.4817 37.1154 21.2801 36.7067C25.8589 36.3168 30.6289 35.7414 34.7247 35.2474C34.9317 35.2224 35.137 35.1977 35.3405 35.1732C39.6067 34.659 42.997 34.2613 44.6338 34.2613Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.05" filter="url(#filter12_f_177_76)">
                    <circle cx="44.8545" cy="21.5518" r="15.3702" fill="#FBF7F5" />
                </g>
                <g filter="url(#filter13_f_177_76)">
                    <circle cx="44.857" cy="21.5523" r="7.68508" fill="#FBF7F5" />
                </g>
                <circle cx="44.8543" cy="21.5516" r="6.50276" fill="#FBF7F5" />
                <g opacity="0.2" filter="url(#filter14_f_177_76)">
                    <path d="M44.8597 33.6705C52.1426 33.6705 58.1608 28.1731 58.1608 21.2561C58.1608 14.3391 52.1426 8.84178 44.8597 8.84178C37.5767 8.84178 31.5586 14.3391 31.5586 21.2561C31.5586 28.1731 37.5767 33.6705 44.8597 33.6705Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter15_f_177_76)">
                    <path d="M44.8564 33.6705C52.1394 33.6705 58.1575 28.1731 58.1575 21.2561C58.1575 14.3391 52.1394 8.84178 44.8564 8.84178C41.3307 8.84178 31.2799 10.1486 22.1359 12.2405C17.5584 13.2877 13.1521 14.5438 9.87338 15.9545C8.2385 16.658 6.83461 17.4204 5.82493 18.2467C4.83731 19.0549 4.06638 20.0587 4.06638 21.2561C4.06638 22.4536 4.83731 23.4574 5.82493 24.2656C6.83461 25.0919 8.2385 25.8543 9.87338 26.5578C13.1521 27.9685 17.5584 29.2246 22.1359 30.2718C31.2799 32.3637 41.3307 33.6705 44.8564 33.6705Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter16_f_177_76)">
                    <path d="M57.2735 21.1681C57.2735 27.489 51.7154 32.6131 44.8591 32.6131C38.0029 32.6131 2 16.0444 2 9.72349C2 3.40262 38.0029 9.72317 44.8591 9.72317C51.7154 9.72317 57.2735 14.8472 57.2735 21.1681Z" fill="#FEAD82" />
                    <path d="M44.8591 33.4998C52.1359 33.4998 58.1602 28.0452 58.1602 21.1681C58.1602 14.291 52.1359 8.83643 44.8591 8.83643C43.2095 8.83643 39.7417 8.45074 35.3702 7.9533C35.1945 7.93331 35.0175 7.91316 34.8392 7.89286C30.6168 7.41209 25.6754 6.84946 20.9293 6.4691C15.9939 6.07356 11.2175 5.87035 7.65739 6.17328C5.88781 6.32385 4.33961 6.60496 3.20802 7.09497C2.08878 7.57964 1.11326 8.40178 1.11326 9.72349C1.11326 10.3248 1.32495 10.9127 1.63441 11.4592C1.94638 12.01 2.38656 12.5696 2.9153 13.1302C3.97212 14.2507 5.46011 15.456 7.22343 16.6926C10.7561 19.17 15.5137 21.8559 20.4617 24.3316C25.4139 26.8094 30.5842 29.0904 34.9544 30.7541C37.1389 31.5858 39.1335 32.2671 40.807 32.7419C42.4564 33.2097 43.8702 33.4998 44.8591 33.4998Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter17_f_177_76)">
                    <path d="M56.9818 21.5515C56.9818 28.0812 51.4534 33.3746 44.6338 33.3746C37.8142 33.3746 2.89062 39.9042 2.89062 33.3746C2.89062 26.8449 37.8142 9.72852 44.6338 9.72852C51.4534 9.72852 56.9818 15.0219 56.9818 21.5515Z" fill="#FEAD82" />
                    <path d="M44.6338 34.2613C51.9064 34.2613 57.8685 28.6068 57.8685 21.5515C57.8685 14.4962 51.9064 8.84178 44.6338 8.84178C43.6431 8.84178 42.2458 9.14337 40.6281 9.62718C38.9858 10.1183 37.0349 10.8229 34.9028 11.6826C30.6374 13.4023 25.6043 15.7595 20.7886 18.32C15.9769 20.8782 11.3548 23.6539 7.92364 26.2145C6.21074 27.4928 4.76617 28.7384 3.74083 29.8958C2.75216 31.0117 2.00388 32.2089 2.00388 33.3746C2.00388 34.6916 2.92121 35.5419 4.03333 36.0546C5.14083 36.5651 6.65273 36.8565 8.37403 37.0124C11.8373 37.3259 16.4817 37.1154 21.2801 36.7067C25.8589 36.3168 30.6289 35.7414 34.7247 35.2474C34.9317 35.2224 35.137 35.1977 35.3405 35.1732C39.6067 34.659 42.997 34.2613 44.6338 34.2613Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.05" filter="url(#filter18_f_177_76)">
                    <circle cx="44.8545" cy="21.5518" r="15.3702" fill="#FBF7F5" />
                </g>
                <g filter="url(#filter19_f_177_76)">
                    <circle cx="44.857" cy="21.5523" r="7.68508" fill="#FBF7F5" />
                </g>
                <circle cx="44.8543" cy="21.5516" r="6.50276" fill="#FBF7F5" />
                <g opacity="0.2" filter="url(#filter20_f_177_76)">
                    <path d="M44.8597 33.6705C52.1426 33.6705 58.1608 28.1731 58.1608 21.2561C58.1608 14.3391 52.1426 8.84178 44.8597 8.84178C37.5767 8.84178 31.5586 14.3391 31.5586 21.2561C31.5586 28.1731 37.5767 33.6705 44.8597 33.6705Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter21_f_177_76)">
                    <path d="M44.8564 33.6705C52.1394 33.6705 58.1575 28.1731 58.1575 21.2561C58.1575 14.3391 52.1394 8.84178 44.8564 8.84178C41.3307 8.84178 31.2799 10.1486 22.1359 12.2405C17.5584 13.2877 13.1521 14.5438 9.87338 15.9545C8.2385 16.658 6.83461 17.4204 5.82493 18.2467C4.83731 19.0549 4.06638 20.0587 4.06638 21.2561C4.06638 22.4536 4.83731 23.4574 5.82493 24.2656C6.83461 25.0919 8.2385 25.8543 9.87338 26.5578C13.1521 27.9685 17.5584 29.2246 22.1359 30.2718C31.2799 32.3637 41.3307 33.6705 44.8564 33.6705Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter22_f_177_76)">
                    <path d="M57.2735 21.1681C57.2735 27.489 51.7154 32.6131 44.8591 32.6131C38.0029 32.6131 2 16.0444 2 9.72349C2 3.40262 38.0029 9.72317 44.8591 9.72317C51.7154 9.72317 57.2735 14.8472 57.2735 21.1681Z" fill="#FEAD82" />
                    <path d="M44.8591 33.4998C52.1359 33.4998 58.1602 28.0452 58.1602 21.1681C58.1602 14.291 52.1359 8.83643 44.8591 8.83643C43.2095 8.83643 39.7417 8.45074 35.3702 7.9533C35.1945 7.93331 35.0175 7.91316 34.8392 7.89286C30.6168 7.41209 25.6754 6.84946 20.9293 6.4691C15.9939 6.07356 11.2175 5.87035 7.65739 6.17328C5.88781 6.32385 4.33961 6.60496 3.20802 7.09497C2.08878 7.57964 1.11326 8.40178 1.11326 9.72349C1.11326 10.3248 1.32495 10.9127 1.63441 11.4592C1.94638 12.01 2.38656 12.5696 2.9153 13.1302C3.97212 14.2507 5.46011 15.456 7.22343 16.6926C10.7561 19.17 15.5137 21.8559 20.4617 24.3316C25.4139 26.8094 30.5842 29.0904 34.9544 30.7541C37.1389 31.5858 39.1335 32.2671 40.807 32.7419C42.4564 33.2097 43.8702 33.4998 44.8591 33.4998Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter23_f_177_76)">
                    <path d="M56.9818 21.5515C56.9818 28.0812 51.4534 33.3746 44.6338 33.3746C37.8142 33.3746 2.89062 39.9042 2.89062 33.3746C2.89062 26.8449 37.8142 9.72852 44.6338 9.72852C51.4534 9.72852 56.9818 15.0219 56.9818 21.5515Z" fill="#FEAD82" />
                    <path d="M44.6338 34.2613C51.9064 34.2613 57.8685 28.6068 57.8685 21.5515C57.8685 14.4962 51.9064 8.84178 44.6338 8.84178C43.6431 8.84178 42.2458 9.14337 40.6281 9.62718C38.9858 10.1183 37.0349 10.8229 34.9028 11.6826C30.6374 13.4023 25.6043 15.7595 20.7886 18.32C15.9769 20.8782 11.3548 23.6539 7.92364 26.2145C6.21074 27.4928 4.76617 28.7384 3.74083 29.8958C2.75216 31.0117 2.00388 32.2089 2.00388 33.3746C2.00388 34.6916 2.92121 35.5419 4.03333 36.0546C5.14083 36.5651 6.65273 36.8565 8.37403 37.0124C11.8373 37.3259 16.4817 37.1154 21.2801 36.7067C25.8589 36.3168 30.6289 35.7414 34.7247 35.2474C34.9317 35.2224 35.137 35.1977 35.3405 35.1732C39.6067 34.659 42.997 34.2613 44.6338 34.2613Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.05" filter="url(#filter24_f_177_76)">
                    <circle cx="44.8545" cy="21.5518" r="15.3702" fill="#FBF7F5" />
                </g>
                <g filter="url(#filter25_f_177_76)">
                    <circle cx="44.857" cy="21.5523" r="7.68508" fill="#FBF7F5" />
                </g>
                <circle cx="44.8543" cy="21.5516" r="6.50276" fill="#FBF7F5" />
                <g opacity="0.2" filter="url(#filter26_f_177_76)">
                    <path d="M44.8597 33.6715C52.1426 33.6715 58.1608 28.1741 58.1608 21.2571C58.1608 14.3401 52.1426 8.84275 44.8597 8.84275C37.5767 8.84275 31.5586 14.3401 31.5586 21.2571C31.5586 28.1741 37.5767 33.6715 44.8597 33.6715Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter27_f_177_76)">
                    <path d="M44.8564 33.6715C52.1394 33.6715 58.1575 28.1741 58.1575 21.2571C58.1575 14.3401 52.1394 8.84275 44.8564 8.84275C41.3307 8.84275 31.2799 10.1496 22.1359 12.2414C17.5584 13.2886 13.1521 14.5447 9.87338 15.9555C8.2385 16.6589 6.83461 17.4214 5.82493 18.2476C4.83731 19.0558 4.06638 20.0597 4.06638 21.2571C4.06638 22.4546 4.83731 23.4584 5.82493 24.2666C6.83461 25.0928 8.2385 25.8553 9.87338 26.5587C13.1521 27.9695 17.5584 29.2256 22.1359 30.2728C31.2799 32.3646 41.3307 33.6715 44.8564 33.6715Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter28_f_177_76)">
                    <path d="M57.2735 21.1691C57.2735 27.4899 51.7154 32.614 44.8591 32.614C38.0029 32.614 2 16.0453 2 9.72446C2 3.4036 38.0029 9.72415 44.8591 9.72415C51.7154 9.72415 57.2735 14.8482 57.2735 21.1691Z" fill="#FEAD82" />
                    <path d="M44.8591 33.5008C52.1359 33.5008 58.1602 28.0462 58.1602 21.1691C58.1602 14.292 52.1359 8.83741 44.8591 8.83741C43.2095 8.83741 39.7417 8.45171 35.3702 7.95427C35.1945 7.93428 35.0175 7.91413 34.8392 7.89383C30.6168 7.41307 25.6754 6.85044 20.9293 6.47008C15.9939 6.07454 11.2175 5.87132 7.65739 6.17425C5.88781 6.32483 4.33961 6.60593 3.20802 7.09595C2.08878 7.58062 1.11326 8.40276 1.11326 9.72446C1.11326 10.3258 1.32495 10.9137 1.63441 11.4602C1.94638 12.011 2.38656 12.5706 2.9153 13.1312C3.97212 14.2517 5.46011 15.457 7.22343 16.6936C10.7561 19.171 15.5137 21.8569 20.4617 24.3326C25.4139 26.8104 30.5842 29.0913 34.9544 30.7551C37.1389 31.5868 39.1335 32.2681 40.807 32.7428C42.4564 33.2107 43.8702 33.5008 44.8591 33.5008Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <g opacity="0.2" filter="url(#filter29_f_177_76)">
                    <path d="M56.9818 21.5525C56.9818 28.0822 51.4534 33.3755 44.6338 33.3755C37.8142 33.3755 2.89062 39.9052 2.89062 33.3755C2.89062 26.8459 37.8142 9.72949 44.6338 9.72949C51.4534 9.72949 56.9818 15.0228 56.9818 21.5525Z" fill="#FEAD82" />
                    <path d="M44.6338 34.2623C51.9064 34.2623 57.8685 28.6078 57.8685 21.5525C57.8685 14.4972 51.9064 8.84275 44.6338 8.84275C43.6431 8.84275 42.2458 9.14434 40.6281 9.62815C38.9858 10.1193 37.0349 10.8239 34.9028 11.6835C30.6374 13.4033 25.6043 15.7605 20.7886 18.3209C15.9769 20.8792 11.3548 23.6549 7.92364 26.2155C6.21074 27.4938 4.76617 28.7394 3.74083 29.8967C2.75216 31.0127 2.00388 32.2099 2.00388 33.3755C2.00388 34.6926 2.92121 35.5429 4.03333 36.0556C5.14083 36.5661 6.65273 36.8575 8.37403 37.0134C11.8373 37.3269 16.4817 37.1164 21.2801 36.7077C25.8588 36.3177 30.6287 35.7424 34.7245 35.2484C34.9316 35.2234 35.137 35.1987 35.3405 35.1741C39.6067 34.66 42.997 34.2623 44.6338 34.2623Z" stroke="#FBF7F5" stroke-width="1.77348" />
                </g>
                <defs>
                    <filter id="filter0_f_177_76" x="27.1197" y="2.63536" width="35.4715" height="35.4695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1.18232" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter1_f_177_76" x="25.3487" y="0.862342" width="39.0136" height="39.0165" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5.9116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter2_f_177_76" x="29.7283" y="5.82986" width="30.2622" height="28.4897" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.471788" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter3_f_177_76" x="3.06146" y="6.65521" width="56.1037" height="26.839" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter4_f_177_76" x="0.10833" y="3.84075" width="59.0568" height="29.4826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter5_f_177_76" x="0.998955" y="6.65521" width="57.8771" height="30.3312" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter6_f_177_76" x="27.1197" y="3.817" width="35.4715" height="35.4695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1.18232" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter7_f_177_76" x="25.3487" y="2.04398" width="39.0136" height="39.0165" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5.9116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter8_f_177_76" x="29.7283" y="7.0115" width="30.2622" height="28.4897" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.471788" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter9_f_177_76" x="3.06146" y="7.83685" width="56.1037" height="26.839" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter10_f_177_76" x="0.10833" y="5.02239" width="59.0568" height="29.4826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter11_f_177_76" x="0.998955" y="7.83685" width="57.8771" height="30.3312" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter12_f_177_76" x="27.1197" y="3.817" width="35.4715" height="35.4695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1.18232" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter13_f_177_76" x="25.3487" y="2.04398" width="39.0136" height="39.0165" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5.9116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter14_f_177_76" x="29.7283" y="7.0115" width="30.2622" height="28.4897" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.471788" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter15_f_177_76" x="3.06146" y="7.83685" width="56.1037" height="26.839" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter16_f_177_76" x="0.10833" y="5.02239" width="59.0568" height="29.4826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter17_f_177_76" x="0.998955" y="7.83685" width="57.8771" height="30.3312" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter18_f_177_76" x="27.1197" y="3.817" width="35.4715" height="35.4695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1.18232" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter19_f_177_76" x="25.3487" y="2.04398" width="39.0136" height="39.0165" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5.9116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter20_f_177_76" x="29.7283" y="7.0115" width="30.2622" height="28.4897" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.471788" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter21_f_177_76" x="3.06146" y="7.83685" width="56.1037" height="26.839" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter22_f_177_76" x="0.10833" y="5.02239" width="59.0568" height="29.4826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter23_f_177_76" x="0.998955" y="7.83685" width="57.8771" height="30.3312" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter24_f_177_76" x="27.1197" y="3.817" width="35.4715" height="35.4695" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="1.18232" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter25_f_177_76" x="25.3487" y="2.04398" width="39.0136" height="39.0165" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="5.9116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter26_f_177_76" x="29.7283" y="7.01248" width="30.2622" height="28.4897" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.471788" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter27_f_177_76" x="3.06146" y="7.83782" width="56.1037" height="26.839" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter28_f_177_76" x="0.10833" y="5.02337" width="59.0568" height="29.4826" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                    <filter id="filter29_f_177_76" x="0.998955" y="7.83782" width="57.8771" height="30.3312" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="0.059116" result="effect1_foregroundBlur_177_76" />
                    </filter>
                </defs>
            </svg>
        </div>
    )
}