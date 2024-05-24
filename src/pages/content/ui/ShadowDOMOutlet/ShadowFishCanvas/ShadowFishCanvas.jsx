import React, { useEffect, useState } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, react, useEditor,  } from 'tldraw';
import { HTMLContainer, ShapeUtil } from 'tldraw'
import { FishShapeUtil } from './FishShape/FishShape.tsx'
import { ContentShapeUtil } from './ContentShape/ContentShape.tsx'
import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";


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

export default function ShadowCanvas({ parsedContent, article }) {
//   const [store] = useState(() => createTLStore({ shapeUtils }));
  const customShapeUtils = [FishShapeUtil, ContentShapeUtil]
  const [reactEditor, setReactEditor] = useState('')
  const { fishOrchestrator } = useFish();
  const fishConfig = ['helper', 'devil']
  const initialPositions = generateNonOverlappingPositions(fishConfig.length)

  useEffect(()=>{
    console.log("REACT EDITOR:", reactEditor)
  }, [reactEditor])


  function handleMoveFish(reactEditor) {
    if(reactEditor){
        console.log("Moving Fish!");
        const newPositions = generateNonOverlappingPositions(fishConfig.length);
        console.log("NEW POSITIONS:", newPositions)
        console.log("REACT EDITOR:", reactEditor)
        reactEditor.animateShapes(fishConfig.map((fishType, index) => {
            return { id:`shape:fish-${fishType}`, x: newPositions[index].x, y: newPositions[index].y}
        }), {
            duration: 500,
            ease: (t) => t * t,
        })
    }
    else{
        console.log("REACT EDITOR:", reactEditor)
        console.error("React Editor not set!")
    }
}

  useEffect(() => {
        fishOrchestrator.on("moveFish", () => handleMoveFish(reactEditor));

        return () => {
            fishOrchestrator.off("moveFish", () => handleMoveFish(reactEditor));
        };
    }, [fishOrchestrator, reactEditor]);

 

  function handleCanvasEvent(e){
    switch(e.name){
        case 'pointer_up':
            // ripple effect
            fishOrchestrator.emit('shadowDOMClick', { x: e.point.x, y: e.point.y })
            break;
        default:
            break;
    }
  }


  return (
    <Tldraw
      shapeUtils={customShapeUtils}
      color='pink'
      onMount={(editor)=>{
        editor.on('event', (event) => handleCanvasEvent(event))
        setReactEditor(editor)
        editor.createShapes(
            [
            // ...fishConfig.map((fishType, index) => {
            //     return { type: 'fish', id:`shape:fish-${fishType}`, x: initialPositions[index].x, y: initialPositions[index].y, props: {config: "fish", personality: fishType, w: 300, h: 200}}
            // }),
            {type: 'content', props: { content: article?.title ? article.title : "Untitled", contentType: 'header'}},
            {type: 'content', props: { content: article?.siteName ? article.siteName : "No site", contentType: 'paragraph'}}
            ]   
        )
      }}
    />
  );
}