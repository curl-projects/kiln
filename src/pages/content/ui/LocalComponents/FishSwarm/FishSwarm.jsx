import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";
import { useEffect, useState, useRef } from "react";
import FishAgentPersistent from "@pages/content/ui/LocalComponents/FishAgentPersistent/FishAgentPersistent.jsx";

export default function FishSwarm({ fishConfig }) {
    const { fishOrchestrator } = useFish();
    const [fishTransforms, setFishTransforms] = useState(() => generateNonOverlappingPositions(fishConfig.length));
    const fishRefs = fishConfig.map(() => useRef(null));
    const fishHeadOffset = { x: -31, y: -31 }; // Adjust these values based on the dimensions of the fish's head
    const [finalOrientationTarget, setFinalOrientationTarget] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [isMoving, setIsMoving] = useState(false)



    function handleMoveFish() {
        const newTransforms = generateNonOverlappingPositions(fishConfig.length);
        setFishTransforms(newTransforms);
        setFinalOrientationTarget(null); // Reset the final orientation target
    }

    function handleTextCreated({ x, y, w, h}){
        console.log("X:", x, "Y:", y, "W:", w, "H:", h)
        const newTransforms = distributeAroundBoundingCircle(fishConfig.length, x, y, w, h, 100);
        setFishTransforms(newTransforms);
        setFinalOrientationTarget({ x: x - fishHeadOffset.x + 22, y: y - fishHeadOffset.y - 24 });
    }

    function handleShadowDOMClick({ x, y }) {
        setSelectedPoint({x, y})

        const newTransforms = distributeInCircle(fishConfig.length, x-fishHeadOffset.x+22, y-fishHeadOffset.y, 250);
        setFishTransforms(newTransforms);
        setFinalOrientationTarget({ x: x-fishHeadOffset.x+22, y: y-fishHeadOffset.y-24 });

    }

    useEffect(() => {
        fishOrchestrator.on("moveFish", handleMoveFish);
        fishOrchestrator.on("shadowDOMClick", handleShadowDOMClick);
        fishOrchestrator.on('textCreated', handleTextCreated)

        return () => {
            fishOrchestrator.off("moveFish", handleMoveFish);
            fishOrchestrator.off("shadowDOMClick", handleShadowDOMClick);
            fishOrchestrator.off('textCreated', handleTextCreated)
        };
    }, [fishOrchestrator]);

    function generateNonOverlappingPositions(numFish) {
        const fishWidth = 300; // Adjust this value according to your fish width
        const fishHeight = 200; // Adjust this value according to your fish height
        const positions = [];
    
        // Initial position is assumed at left: 0, top: 0
        // Generate initial random positions within the viewport limits
        for (let i = 0; i < numFish; i++) {
            positions.push({
                transformX: Math.random() * (window.innerWidth - fishWidth),
                transformY: Math.random() * (window.innerHeight - fishHeight)
            });
        }
    
        let hasOverlaps;
        do {
            hasOverlaps = false;
            for (let i = 0; i < positions.length; i++) {
                // Adjust position if out of bounds
                if (positions[i].transformX < 0) positions[i].transformX = 0;
                if (positions[i].transformY < 0) positions[i].transformY = 0;
                if (positions[i].transformX + fishWidth > window.innerWidth) positions[i].transformX = window.innerWidth - fishWidth;
                if (positions[i].transformY + fishHeight > window.innerHeight) positions[i].transformY = window.innerHeight - fishHeight;
    
                for (let j = i + 1; j < positions.length; j++) {
                    const dx = Math.abs(positions[i].transformX - positions[j].transformX);
                    const dy = Math.abs(positions[i].transformY - positions[j].transformY);
                    if (dx < fishWidth && dy < fishHeight) {
                        hasOverlaps = true;
                        // Adjust positions to remove overlap
                        positions[j].transformX = (positions[j].transformX + fishWidth) % (window.innerWidth - fishWidth);
                        positions[j].transformY = (positions[j].transformY + fishHeight) % (window.innerHeight - fishHeight);
                    }
                }
            }
        } while (hasOverlaps);
    
        return positions;
    }
    
    function distributeInCircle(numFish, centerX, centerY, radius) {
        console.log("Generating Circular Fish Positions");
        const angleStep = (2 * Math.PI) / numFish;
        const positions = [];
        const fishWidth = 120;
        const fishHeight = 45;
      
        for (let i = 0; i < numFish; i++) {
            const angle = i * angleStep;
            const fishCenterX = centerX + radius * Math.cos(angle);
            const fishCenterY = centerY + radius * Math.sin(angle);
        
            // Calculate the transform from the initial position (left: 0, top: 0)
            let transformX = fishCenterX - fishWidth / 2;
            let transformY = fishCenterY - fishHeight / 2;
        
            // Ensure that positions are adjusted to be within the viewport
            if (transformX < 0) transformX = 0;
            if (transformY < 0) transformY = 0;
            if (transformX + fishWidth > window.innerWidth) transformX = window.innerWidth - fishWidth;
            if (transformY + fishHeight > window.innerHeight) transformY = window.innerHeight - fishHeight;
    
            positions.push({ transformX, transformY });
        }
      
        return positions;
    }

    function distributeAroundBoundingCircle(numFish, x, y, w, h, radiusOffset) {
        console.log("Generating Fish Positions Around Bounding Circle");
        const positions = [];
        const fishWidth = 120;
        const fishHeight = 45;
    
        // Calculate center of the bounding box
        const centerX = x + w / 2;
        const centerY = y + h / 2;
    
        // Calculate the radius of the circle (half of the diagonal of the bounding box)
        const boundingBoxRadius = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2) + radiusOffset;
    
        const angleStep = (2 * Math.PI) / numFish;
    
        for (let i = 0; i < numFish; i++) {
            const angle = i * angleStep;
            const fishCenterX = centerX + boundingBoxRadius * Math.cos(angle);
            const fishCenterY = centerY + boundingBoxRadius * Math.sin(angle);
    
            // Calculate the transform from the initial position (left: 0, top: 0)
            let transformX = fishCenterX - fishWidth / 2;
            let transformY = fishCenterY - fishHeight / 2;
    
            // Ensure that positions are adjusted to be within the viewport
            if (transformX < 0) transformX = 0;
            if (transformY < 0) transformY = 0;
            if (transformX + fishWidth > window.innerWidth) transformX = window.innerWidth - fishWidth;
            if (transformY + fishHeight > window.innerHeight) transformY = window.innerHeight - fishHeight;
    
            positions.push({ transformX, transformY });
        }
    
        return positions;
    }
    





    //   function handlePositionChange(index, transformX, transformY) {
    //     console.log("POSITION CHANGING!")
    //     setFishTransforms(currentPositions => {
    //         const updatedPositions = [...currentPositions];
    //         updatedPositions[index] = { transformX: transformX, transformY: transformY };
    //         return updatedPositions;
    //     });
    // }


    return (
        <>
            {fishConfig.map((fishType, index) => {

                return <FishAgentPersistent 
                            key={index} 
                            index={index}
                            ref={fishRefs[index]} 
                            fishHeadOffset={fishHeadOffset}
                            transform={fishTransforms[index]}
                            fishType={fishType}
                            onPositionChange={(transformX, transformY) => handlePositionChange(index, transformX, transformY)}
                            finalOrientationTarget={finalOrientationTarget}
                            />;
            })}
            {selectedPoint && 
                <div 
                style={{
                    position: 'fixed', 
                    left: selectedPoint.x, 
                    top: selectedPoint.y, 
                    width: 10, 
                    height: 10,
                    zIndex: '2147483647',
                    backgroundColor: 'orange'}}>
                </div>}
        </>
    );
}



