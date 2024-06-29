import React, { useEffect, useState } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, react, useEditor, createShapeId  } from 'tldraw';
import { HTMLContainer, ShapeUtil } from 'tldraw'
import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";
import _ from 'lodash';
import { handleDoubleClickOnCanvas } from '../../../ui-old/RichTextShape/canvasOverride.tsx';
// IMPORTING UI
import CustomToolbar from './CustomUI/CustomToolbar/CustomToolbar.jsx';

import customCreateSnapshot from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/WorldModelShape/shared/customCreateSnapshot.ts"
// import { ContentTool } from './CustomUI/CustomToolbar/CustomTools/ContentTool.tsx';
// import { FishShapeUtil } from './FishShape/FishShape.tsx'
// import { ContentShapeUtil } from './ContentShape/ContentShape.tsx'
// import { RichTextShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/RichTextShapeUtil.tsx"

// import { TipTapShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/TipTapShape/TipTapShapeUtil.tsx"
import { WorldModelShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/WorldModelShape/WorldModelShapeUtil.tsx"
import { WorldModelShapeTool } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/WorldModelShape/WorldModelShapeTool.tsx"

import { KinematicCanvasShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/KinematicCanvasShape/KinematicCanvasShapeUtil.tsx"
import { KinematicCanvasShapeTool } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/KinematicCanvasShape/KinematicCanvasShapeTool.tsx"
import { KinematicCanvasBindingUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/KinematicCanvasShape/KinematicCanvasModelBinding/KinematicCanvasBindingUtil.tsx"


import { MediaShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/MediaShape/MediaShapeUtil.tsx"
import { MediaShapeTool } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/MediaShape/MediaShapeTool.tsx"
import { MediaConceptBindingUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/MediaShape/MediaConceptBindUtil.tsx"

import { ConceptShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/ConceptShape/ConceptShapeUtil.tsx"
import { ConceptShapeTool } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/ConceptShape/ConceptShapeTool.tsx"

// import text tool

// import { TipTapShapeTool } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/TipTapShape/TipTapShapeTool.tsx"
// import { IFrameShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/IFrameShape/IFrameShape"

export default function ShadowCanvas({ parsedContent, article }) {
//   const [store] = useState(() => createTLStore({ shapeUtils }));
  const customShapeUtils = [WorldModelShapeUtil, MediaShapeUtil, ConceptShapeUtil, KinematicCanvasShapeUtil]

  const customBindingUtils = [KinematicCanvasBindingUtil, MediaConceptBindingUtil]
  const customTools = [
    WorldModelShapeTool,
    MediaShapeTool,
    ConceptShapeTool,
    KinematicCanvasShapeTool,
]
  const customComponents = {
    Toolbar: null,
    HelpMenu: null,
    MainMenu: null,
    // DebugMenu: null,
    PageMenu: null,
    ActionsMenu: null,
    ZoomMenu: null,
    QuickActions: null,

  }

  // TODO: think this might be irrelevant
  const uiOverrides = {
    tools(editor, tools){
        tools.tiptap = {
            id: 'concept',
            icon: 'content-icon',
            label: "Concept",
            kbd: 'c',
            onSelect: () => {
                editor.setCurrentTool('concept')
            }
        }

        tools.media = { 
          id: 'media',
          icon: 'content-icon',
          label: "Media",
          kbd: 'm',
          onSelect: () => {
            editor.setCurrentTool('media')
          }
        }

        tools.worldModel = {
          id: 'worldModel',
          icon: "content-icon",
          label: "World Model",
          kbd: "w",
          onSelect: () => {
            editor.setCurrentTool('worldModel')
          }
        }

        return tools
    }
  }

  const [reactEditor, setReactEditor] = useState('')
  const [hoveredShape, setHoveredShape] = useState(undefined)
  const [selectedShapes, setSelectedShapes] = useState([])
  const { fishOrchestrator } = useFish();
  
  const [textCreated, setTextCreated] = useState(null)
  
  function handleCanvasEvent(e, editor){
    if(editor){  
                  
      const newSelectedShapes = editor.getSelectedShapes();
      const newHoveredShape = editor.getHoveredShape();

      // console.log("POINTER UP:", newSelectedShapes)

        // Compare and update state only if different
        if (selectedShapes !== newSelectedShapes) {
          setSelectedShapes(newSelectedShapes);
        }

        if (hoveredShape !== newHoveredShape) {
          setHoveredShape(newHoveredShape);
        }
        
      switch(e.name){
          case 'pointer_up':
              // ripple effect


              // fishOrchestrator.emit('shadowDOMClick', { x: e.point.x, y: e.point.y })
              break;
          // case "double_click":
          //       const editorSelectedShapes = editor.getSelectedShapes()
          //       if (editorSelectedShapes.length > 0) break;
          //       editor.setCurrentTool("richText") // Or any other wanted tool
          //       const id = createShapeId()
          //       editor.createShapes([
          //         {
          //           id,
          //           type: 'richText',
          //           x: e.point.x,
          //           y: e.point.y,
          //           props: {
          //             text: '',
          //             autoSize: true,
          //           },
          //         },
          //       ]).select(id)
          //       editor.setEditingShape(id)
          //       // editor.setCurrentTool('select')
          //       // editor.root.getCurrent()?.transition('editing_shape')
          //       break
            
          default:
              break;
      }
    }
  }


  function handleStoreEvent(change){
        for (const record of Object.values(change.changes.added)) {
            if (record.typeName === 'shape') {
                console.log(`created shape (${record.type})\n`)
                if(record.type === 'richText'){
                    setTextCreated(record)
                }
            }

        for (const [from, to] of Object.values(change.changes.updated)) {
            if (
                from.typeName === 'instance' &&
                to.typeName === 'instance' &&
                from.currentPageId !== to.currentPageId
            ) {
                logChangeEvent(`changed page (${from.currentPageId}, ${to.currentPageId})`)
            } else if (from.id.startsWith('shape') && to.id.startsWith('shape')) {
                let diff = _.reduce(
                    from,
                    (result, value, key) =>
                        _.isEqual(value, (to)[key]) ? result : result.concat([key, (to)[key]]),
                    []
                )
                if (diff?.[0] === 'props') {
                    diff = _.reduce(
                        (from).props,
                        (result, value, key) =>
                            _.isEqual(value, (to).props[key])
                                ? result
                                : result.concat([key, (to).props[key]]),
                        []
                    )
                }
                console.log("update shape:", diff)
            }
        }

        for (const record of Object.values(change.changes.removed)) {
            if (record.typeName === 'shape') {
              console.log("deleted shape:", (record.type))
            }
        }
    }
  }

  function handleUiEvent(e){
    console.log("UI EVENT", e)
  }

  return (
    <Tldraw
      shapeUtils={customShapeUtils}
      tools={customTools}
      overrides={uiOverrides}
      components={customComponents}
      bindingUtils={customBindingUtils}

      onUiEvent={handleUiEvent}
      onMount={(editor)=>{


        editor.root.children.select.children.resizing._createSnapshot = customCreateSnapshot;
      
       
        editor.root.children.select.children.idle.handleDoubleClickOnCanvas = function(info) {
          handleDoubleClickOnCanvas.call(this, info);
        }.bind({ editor, parent: editor.root.children.select.children.idle.parent });


        setReactEditor(editor)

        


        // WORLD MODEL DECLARATION
        // editor.shapeUtils.frame.component = () => {
        //   return(
        //     <div>
        //       <h1>Hi</h1>
        //     </div>
        //   )
        // }
        editor.on('event', (event) => handleCanvasEvent(event, editor))
        // editor.on('change', (event) => handleChange(event, editor))
        // editor.on('', (e) => console.log("SELECTION CHANGE", e))
        editor.store.listen(handleStoreEvent)
        // editor.createShape({ type: 'my-custom-shape', x: 100, y: 100 })

        editor.sideEffects.registerBeforeChangeHandler(
          'shape',
          (prev, next, source) => {
            // console.log("PREV:", prev)
            // console.log("NEXT:", next)
            return next
          }
        )
        

        editor.sideEffects.registerAfterChangeHandler(
          'shape',
          (prev, next, source) => {
            // console.log("PREV:", prev)
            // console.log("NEXT:", next)
            return next
          }
        )

        editor.sideEffects.registerAfterCreateHandler('shape', (shape) => {
          console.log("HI!")
          if(shape.type === 'media'){

            for(let mediaConcept of shape.props.concepts){
              let mediaConceptId = createShapeId();
              editor.createShape({
                id: mediaConceptId,
                type: mediaConcept.type,
                x: 0,
                y: 0,
                props: {
                  text: mediaConcept.text,
                }
              })

              editor.reparentShapes([mediaConceptId], shape.id)

              editor.createBinding({
                type: "mediaConcept",
                fromId: mediaConceptId,
                toId: shape.id,
              })
            }



            // const padding = 20
            // const minX = shape.x + padding, maxX = shape.x + shape.props.w - padding;
            // const minY = shape.y + padding, maxY = shape.y + shape.props.h - padding;
            
            // editor.batch(() => {
            //   const conceptShapes = shape.props.concepts.map((el) => {
            //     return(
            //       {
            //         id: createShapeId(),
            //         type: el.type,
            //         x: minX + Math.random() * (maxX - minX),
            //         y: minY + Math.random() * (maxY - minY),
            //         props: {
            //           text: el.text,
            //         }
            //       }
            //     )	
            //   })
  
            //   console.log("CONCEPT SHAPES:", conceptShapes)
  
            //   const createdShapes = editor.createShapes(conceptShapes)
  
            //   console.log("CREATED SHAPES:", createdShapes)
  
            //   editor.reparentShapes(conceptShapes, shape.id)
              
            // })

          }  
        })

  
      }}
    >
        <CustomToolbar />
    </Tldraw>
  );
}



  // useEffect(()=>{
  //   console.debug("SELECTED SHAPES:", selectedShapes)
  // }, [selectedShapes])



  // useEffect(()=>{
  //   // console.log("SELECTED SHAPES:", selectedShapes)
  //   if(textCreated && (selectedShapes && selectedShapes.length === 0)){
  //       // console.log("TRIGGERED!", textCreated)
  //       if(reactEditor){
  //         const shapeGeometry = reactEditor.getShapeGeometry(textCreated.id)
  //         // console.log("CORRECT SHAPE:", shapeGeometry)

  //         const textShape = reactEditor.getShape(textCreated.id)

  //         // console.log("RICH TEXT SHAPE:", textShape)
  //         if(shapeGeometry.w){
  //           fishOrchestrator.emit('textCreated', { 
  //             x: textCreated.x, 
  //             y: textCreated.y , 
  //             w: shapeGeometry.w,
  //             h: shapeGeometry.h,
  //             prompt: {
  //               type: "respondToCreatedText",
  //               aiData: {
  //                 text: textShape.props.text
  //               }
  //             },
              
  //           })
  //         }
  //       }

        
  //       setTextCreated(null)
  //   }
  // }, [textCreated, selectedShapes])
