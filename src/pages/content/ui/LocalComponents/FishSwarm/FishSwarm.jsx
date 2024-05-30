import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";
import { useEffect, useState, useRef } from "react";
import FishAgentPersistent from "@pages/content/ui/LocalComponents/FishAgentPersistent/FishAgentPersistent.jsx";

export default function FishSwarm() {
    const { fishOrchestrator, fishConfig } = useFish();
    const [fishTransforms, setFishTransforms] = useState(() => generateInitialPositions(fishConfig));
    const [fishOrientationTargets, setFishOrientationTargets] = useState({});
    const fishRefs = fishConfig.map(() => useRef(null));
    const fishHeadOffset = { x: -32.5, y: -32.5 };
    const [selectedPoint, setSelectedPoint] = useState(null);

    function handleMoveFish({ fishNames }) {
        const newTransforms = generateNonOverlappingPositions(fishNames.length);
        setFishTransforms((prevTransforms) => {
            const updatedTransforms = { ...prevTransforms };
            fishNames.forEach((name, index) => {
                updatedTransforms[name] = newTransforms[index];
            });
            return updatedTransforms;
        });
        setFishOrientationTargets((prevTargets) => {
            const updatedTargets = { ...prevTargets };
            fishNames.forEach((name) => {
                updatedTargets[name] = null;
            });
            return updatedTargets;
        });
    }

    function handleTextCreated({ x, y, w, h, text, fishNames }) {
        setSelectedPoint({ x: x, y, w, h });
        const offset = 250;
        const newTransforms = distributeInEllipse(fishNames, x - fishHeadOffset.x, y - fishHeadOffset.y, w + offset, h + offset, fishConfig);
        setFishTransforms((prevTransforms) => {
            return { ...prevTransforms, ...newTransforms };
        });
        setFishOrientationTargets((prevTargets) => {
            const updatedTargets = { ...prevTargets };
            fishNames.forEach((name) => {
                updatedTargets[name] = { x: x - fishHeadOffset.x + 22, y: y - fishHeadOffset.y - 24 };
            });
            return updatedTargets;
        });
    }
    
    

    function handleShadowDOMClick({ x, y, fishNames }) {
        setSelectedPoint({ x, y });
        const newTransforms = distributeInEllipse(fishNames, x - fishHeadOffset.x + 8, y - fishHeadOffset.y, 250, 200, fishConfig);
        setFishTransforms((prevTransforms) => {
            return { ...prevTransforms, ...newTransforms };
        });
        setFishOrientationTargets((prevTargets) => {
            const updatedTargets = { ...prevTargets };
            fishNames.forEach((name) => {
                updatedTargets[name] = { x: x - fishHeadOffset.x, y: y - fishHeadOffset.y };
            });
            return updatedTargets;
        });
    }
    
    

    useEffect(() => {
        fishOrchestrator.on("moveFish", handleMoveFish);
        fishOrchestrator.on("shadowDOMClick", handleShadowDOMClick);
        fishOrchestrator.on('textCreated', handleTextCreated);

        return () => {
            fishOrchestrator.off("moveFish", handleMoveFish);
            fishOrchestrator.off("shadowDOMClick", handleShadowDOMClick);
            fishOrchestrator.off('textCreated', handleTextCreated);
        };
    }, [fishOrchestrator]);

    function generateInitialPositions(fishConfig) {
        const positions = {};
        fishConfig.forEach(fish => {
            positions[fish.name] = { transformX: Math.random() * window.innerWidth, transformY: Math.random() * window.innerHeight };
        });
        return positions;
    }

    function generateNonOverlappingPositions(fishNames, fishConfig) {
        const positions = {};
        const fishWidth = 300; 
        const fishHeight = 200; 
    
        // Initialize random positions for each fish by name
        fishNames.forEach(name => {
            positions[name] = {
                transformX: Math.random() * (window.innerWidth - fishWidth),
                transformY: Math.random() * (window.innerHeight - fishHeight)
            };
        });
    
        let hasOverlaps;
        do {
            hasOverlaps = false;
            fishNames.forEach((name, i) => {
                // Adjust position if out of bounds
                if (positions[name].transformX < 0) positions[name].transformX = 0;
                if (positions[name].transformY < 0) positions[name].transformY = 0;
                if (positions[name].transformX + fishWidth > window.innerWidth) positions[name].transformX = window.innerWidth - fishWidth;
                if (positions[name].transformY + fishHeight > window.innerHeight) positions[name].transformY = window.innerHeight - fishHeight;
    
                // Check overlaps with all other fish
                fishNames.forEach((otherName, j) => {
                    if (i !== j) {
                        const dx = Math.abs(positions[name].transformX - positions[otherName].transformX);
                        const dy = Math.abs(positions[name].transformY - positions[otherName].transformY);
                        if (dx < fishWidth && dy < fishHeight) {
                            hasOverlaps = true;
                            // Adjust positions to remove overlap
                            positions[otherName].transformX = (positions[otherName].transformX + fishWidth) % (window.innerWidth - fishWidth);
                            positions[otherName].transformY = (positions[otherName].transformY + fishHeight) % (window.innerHeight - fishHeight);
                        }
                    }
                });
            });
        } while (hasOverlaps);
    
        return positions;
    }
    
    
    function distributeInEllipse(fishNames, centerX, centerY, radiusX, radiusY, fishConfig) {
        console.log('DISTRIBUTE IN ELLIPSE:', fishNames, centerX, centerY, radiusX, radiusY, fishConfig)
        const angleStep = (2 * Math.PI) / fishNames.length;
        const positions = {};
        const fishWidth = 70;
        const fishHeight = 70;

       
    
        fishNames.forEach((name, index) => {
            const angle = index * angleStep;
            const fishCenterX = centerX + radiusX * Math.cos(angle);
            const fishCenterY = centerY + radiusY * Math.sin(angle);
    
            let transformX = fishCenterX - fishWidth / 2;
            let transformY = fishCenterY - fishHeight / 2;
    
            if (transformX < 0) transformX = 0;
            if (transformY < 0) transformY = 0;
            if (transformX + fishWidth > window.innerWidth) transformX = window.innerWidth - fishWidth;
            if (transformY + fishHeight > window.innerHeight) transformY = window.innerHeight - fishHeight;
    
            positions[name] = { transformX, transformY };
        });
    
        return positions;
    }
        
    
    return (
        <>
            {fishConfig.map((fish, index) => {
                const transform = fishTransforms[fish.name];
                const finalOrientationTarget = fishOrientationTargets[fish.name];
                return <FishAgentPersistent 
                            key={fish.name} 
                            ref={fishRefs[index]} 
                            fishHeadOffset={fishHeadOffset}
                            transform={transform}
                            fishType={fish.name}
                            finalOrientationTarget={finalOrientationTarget}
                        />;
            })}
            {selectedPoint && 
                <div 
                style={{
                    position: 'fixed', 
                    left: selectedPoint.x, 
                    pointerEvents: 'none',
                    top: selectedPoint.y, 
                    width: selectedPoint?.w || 10, 
                    height: selectedPoint?.h || 10,
                    zIndex: '2147483647',
                    backgroundColor: selectedPoint?.w ? "none" : 'orange',
                    border: selectedPoint?.w ? "1px solid orange" : "none", 
                }}>
                </div>}
        </>
    );
}
