import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";
import { useEffect, useState, useRef } from "react";
import FishAgent from "@pages/content/ui/LocalComponents/FishAgent/FishAgent.jsx";

export default function FishSwarm({ fishConfig }) {
    const { fishOrchestrator } = useFish();
    const [fishPositions, setFishPositions] = useState(() => generateNonOverlappingPositions(fishConfig.length));
    const fishRefs = fishConfig.map(() => useRef(null));

    function handleMoveFish() {
        console.log("Moving Fish!");
        const newPositions = generateNonOverlappingPositions(fishConfig.length);
        setFishPositions(newPositions);
    }

    function handleShadowDOMClick({ x, y }) {
        console.log("Moving Fish!");
        const newPositions = distributeInCircle(fishConfig.length, x, y, 200);
        setFishPositions(newPositions);
    }

    useEffect(() => {
        fishOrchestrator.on("moveFish", handleMoveFish);
        fishOrchestrator.on("shadowDOMClick", handleShadowDOMClick);

        return () => {
            fishOrchestrator.off("moveFish", handleMoveFish);
        };
    }, [fishOrchestrator]);

    function generateNonOverlappingPositions(numFish) {
        console.log("Generating Non Overlapping Fish Positions")
        const fishWidth = 300; // Adjust this value according to your fish width
        const fishHeight = 200; // Adjust this value according to your fish height
        const positions = [];

        for (let i = 0; i < numFish; i++) {
            positions.push({
                x: Math.random() * (window.innerWidth - fishWidth),
                y: Math.random() * (window.innerHeight - fishHeight)
            });
        }

        let hasOverlaps;
        do {
            hasOverlaps = false;
            for (let i = 0; i < positions.length; i++) {
                // Adjust position if out of bounds
                if (positions[i].x < 0) positions[i].x = 0;
                if (positions[i].y < 0) positions[i].y = 0;
                if (positions[i].x + fishWidth > window.innerWidth) positions[i].x = window.innerWidth - fishWidth;
                if (positions[i].y + fishHeight > window.innerHeight) positions[i].y = window.innerHeight - fishHeight;

                for (let j = i + 1; j < positions.length; j++) {
                    const dx = Math.abs(positions[i].x - positions[j].x);
                    const dy = Math.abs(positions[i].y - positions[j].y);
                    if (dx < fishWidth && dy < fishHeight) {
                        hasOverlaps = true;
                        // Adjust positions to remove overlap
                        positions[j].x = (positions[j].x + fishWidth) % (window.innerWidth - fishWidth);
                        positions[j].y = (positions[j].y + fishHeight) % (window.innerHeight - fishHeight);
                    }
                }
            }
        } while (hasOverlaps);

        return positions;
    }

    function distributeInCircle(numFish, centerX, centerY, radius) {
        console.log("Generating Circular Fish Positions")
        const angleStep = (2 * Math.PI) / numFish;
        const positions = [];
        const fishWidth = 300;
        const fishHeight = 200;
      
        for (let i = 0; i < numFish; i++) {
          const angle = i * angleStep;
          const fishCenterX = centerX + radius * Math.cos(angle);
          const fishCenterY = centerY + radius * Math.sin(angle);
      
          const x = fishCenterX - fishWidth / 2;
          const y = fishCenterY - fishHeight / 2;
      
          positions.push({ x, y });
        }
      
        return positions;
      }

      function handlePositionChange(index, newX, newY, fishPositions) {
        fishPositions && setFishPositions(currentPositions => {
            const updatedPositions = [...currentPositions];
            updatedPositions[index] = { x: newX, y: newY };
            return updatedPositions;
        });
      }



    return (
        <>
            {fishConfig.map((fishType, index) => {
                const { x, y } = fishPositions[index];

                return <FishAgent 
                            key={index} 
                            ref={fishRefs[index]} 
                            x={x} 
                            y={y} 
                            fishType={fishType}
                            onPositionChange={(newX, newY) => handlePositionChange(index, newX, newY, fishPositions)}
                            />;
            })}
        </>
    );
}
