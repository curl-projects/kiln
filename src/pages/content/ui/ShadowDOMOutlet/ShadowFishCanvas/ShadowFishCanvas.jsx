import { openDB } from 'idb';
import { throttle } from 'lodash'
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, defaultBindingUtils, react, useEditor, createShapeId, DefaultSpinner, getSnapshot, loadSnapshot  } from 'tldraw';
import { HTMLContainer, ShapeUtil } from 'tldraw'
import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";
import _ from 'lodash';
import { handleDoubleClickOnCanvas } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/CustomUI/canvasOverride.tsx"

import { fetchInferredConcepts } from "@pages/content/ui/ServerFuncs/api.tsx"

// IMPORTING UI
import CustomToolbar from './CustomUI/CustomToolbar/CustomToolbar.jsx';
import { CustomProjectTracker } from './CustomUI/CustomToolbar/CustomProjectTracker.jsx';
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

import { FeedShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/FeedShape/FeedShapeUtil.tsx"
import { FeedBindingUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/FeedShape/FeedShapeBindingUtil.tsx"

import { FishShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/FishShape/FishShapeUtil.tsx"
import { FishWorldModelBindingUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/FishShape/FishWorldModelBindingUtil.tsx"

import { SearchShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/FeedShape/SearchShape/SearchShapeUtil.tsx"
import { SearchBindingUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/FeedShape/SearchShape/SearchShapeBindingUtil.tsx"

// import text tool

// import { TipTapShapeTool } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/TipTapShape/TipTapShapeTool.tsx"
// import { IFrameShapeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/IFrameShape/IFrameShape"

export default function ShadowCanvas({ parsedContent, article }) {
//   const [store] = useState(() => createTLStore({ shapeUtils }));
  const customShapeUtils = [WorldModelShapeUtil, MediaShapeUtil, ConceptShapeUtil, KinematicCanvasShapeUtil, FishShapeUtil, FeedShapeUtil, SearchShapeUtil]

  const customBindingUtils = [KinematicCanvasBindingUtil, MediaConceptBindingUtil, FeedBindingUtil, SearchBindingUtil, FishWorldModelBindingUtil]
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
    DebugMenu: null,
    DebugPanel: null,
    Minimap: null,
    PageMenu: null,
    ActionsMenu: null,
    ZoomMenu: null,
    QuickActions: null,
    NavigationPanel: null,
    // ContextMenu: null,
    StylePanel: CustomProjectTracker,
    // SharePanel: CustomProjectTracker,
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

  // STORE CONFIG
  



  const [reactEditor, setReactEditor] = useState('')
  const [hoveredShape, setHoveredShape] = useState(undefined)
  const [selectedShapes, setSelectedShapes] = useState([])
  const { fishOrchestrator } = useFish();
  const [textCreated, setTextCreated] = useState(null)



  const PERSISTENCE_KEY = 'kiln-persistence'

  const [store, setStore] = useState(() => createTLStore({ shapeUtils: [...defaultShapeUtils, ...customShapeUtils], bindingUtils: [...defaultBindingUtils, ...customBindingUtils] }))
	//[2]
	const [loadingState, setLoadingState] = useState({
		status: 'loading',
	})
	//[3]
  
  


	useLayoutEffect(() => {
    async function loadData(){
      setLoadingState({ status: 'loading' })
      const inMessage = await chrome.runtime.sendMessage({ action: "retrieve" })

      console.log("IN MESSAGE", inMessage)
      const persistedSnapshot = inMessage?.data?.kiln

      // Get persisted data from local storag
      if (persistedSnapshot) {
        try {
          const snapshot = JSON.parse(persistedSnapshot)
          loadSnapshot(store, snapshot)
          setLoadingState({ status: 'ready' })
        } catch (error) {
          setLoadingState({ status: 'error', error: error.message }) // Something went wrong
        }
      } else {
        setLoadingState({ status: 'ready' }) // Nothing persisted, continue with the empty store
      }
    }

    loadData()

    // Each time the store changes, run the (debounced) persist function
		const cleanupFn = store.listen(
			throttle(() => {
				const snapshot = getSnapshot(store)
				const outMessage = chrome.runtime.sendMessage({ action: 'save', snapshot: JSON.stringify(snapshot) });
			}, 100)
		)
  
    return () => {
      cleanupFn();
    };
  }, [store]);
  


  
  // function handleCanvasEvent(e, editor){
  //   if(editor){  
                  
  //     const newSelectedShapes = editor.getSelectedShapes();
  //     const newHoveredShape = editor.getHoveredShape();
 
  //     // console.log("POINTER UP:", newSelectedShapes)

  //       // Compare and update state only if different
  //       if (selectedShapes !== newSelectedShapes) {
  //         setSelectedShapes(newSelectedShapes);
  //       }

  //       if (hoveredShape !== newHoveredShape) {
  //         setHoveredShape(newHoveredShape);
  //       }
        
  //     switch(e.name){
  //         case 'pointer_up':
  //             // ripple effect


  //             // fishOrchestrator.emit('shadowDOMClick', { x: e.point.x, y: e.point.y })
  //             break;
  //         // case "double_click":
  //         //       const editorSelectedShapes = editor.getSelectedShapes()
  //         //       if (editorSelectedShapes.length > 0) break;
  //         //       editor.setCurrentTool("richText") // Or any other wanted tool
  //         //       const id = createShapeId()
  //         //       editor.createShapes([
  //         //         {
  //         //           id,
  //         //           type: 'richText',
  //         //           x: e.point.x,
  //         //           y: e.point.y,
  //         //           props: {
  //         //             text: '',
  //         //             autoSize: true,
  //         //           },
  //         //         },
  //         //       ]).select(id)
  //         //       editor.setEditingShape(id)
  //         //       // editor.setCurrentTool('select')
  //         //       // editor.root.getCurrent()?.transition('editing_shape')
  //         //       break
            
  //         default:
  //             break;
  //     }
  //   }
  // }


  function handleStoreEvent(change){
    // if(change.changes.updated && change.changes.update)
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

  // function handleUiEvent(e){
  //   console.log("UI EVENT", e)
  // }

  if (loadingState.status === 'loading') {
		return (
			<div className="tldraw__editor">
				<h2>
					<DefaultSpinner />
				</h2>
			</div>
		)
	}

	if (loadingState.status === 'error') {
		return (
			<div className="tldraw__editor">
				<h2>Error!</h2>
				<p>{loadingState.error}</p>
			</div>
		)
	}


  return (
    <Tldraw
      store={store}
      shapeUtils={customShapeUtils}
      tools={customTools}
      
      overrides={uiOverrides}
      components={customComponents}
      bindingUtils={customBindingUtils}


      // onUiEvent={handleUiEvent}
      onMount={(editor)=>{
        if(editor){
          editor.root.children.select.children.resizing._createSnapshot = customCreateSnapshot;
            editor.store.listen(handleStoreEvent)
          editor.root.children.select.children.idle.handleDoubleClickOnCanvas = function(info) {
            handleDoubleClickOnCanvas.call(this, info);
          }.bind({ editor, parent: editor.root.children.select.children.idle.parent });  
        }

        // necessary to avoid weird copy-paste issues
        document.addEventListener('mouseover', function(event) {
          var targetElement = event.target; // Get the element that was clicked
          // console.log("MOUSE OVER", event.target)
          
          function getHighestParent(node) {
            let current = node;
            while (current.parentNode && current.parentNode !== document.body) {
                current = current.parentNode;
            }
            return current;
          }
        
          const highestParent = getHighestParent(event.target);

          // Check if the clicked element is the div with id kiln-page-container
          if (highestParent.id === 'kiln-page-container') {
              editor.setSelectedShapes([])
          }
      });
      
  

        setReactEditor(editor)

        // editor.on('event', (event) => handleCanvasEvent(event, editor))
        // editor.on('change', (event) => handleChange(event, editor))
        // editor.on('', (e) => console.log("SELECTION CHANGE", e))
        // editor.store.listen(
        //   throttle(async () => {
        //     console.log("UPLOADING DATA:");
        //     const snapshot = getSnapshot(editor.store);
        //     // send message to backend
        //     const outMessage = await chrome.runtime.sendMessage({ action: 'save', snapshot: JSON.stringify(snapshot) });
        //     // localStorage.setItem('kiln', JSON.stringify(snapshot));
        //   }, 500)
        // )
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
          if(shape.type === 'feed'){
            editor.batch(()=>{
              const searchId = createShapeId();

              editor.createShape({
                id: searchId,
                type: "search",
                x: shape.x,
                y: shape.y,
                props: {
                  w: shape.props.w
                }
              })

              editor.registerExternalContentHandler('text', async ({ point, sources }) => {
                console.log("HI")
              })

              editor.reparentShapes([searchId], shape.id)

              editor.createBinding({
                type: "searchFeedBinding",
                fromId: searchId,
                toId: shape.id,
              })

            })
          }
          if(shape.type === 'media'){
            if(shape.props.text !== "\"\""){

              // generate concepts
              console.log("Generating Inferred Concepts After Shape Creation")
              fetchInferredConcepts(editor, shape, [{text: shape.props.text}])
            }
          }

          if(shape.type === 'worldModel'){
            editor.batch(()=>{
              const fishId = createShapeId();

              editor.createShape({
                id: fishId,
                type: "fish",
                x: shape.x,
                y: shape.y,
              })

              editor.reparentShapes([fishId], shape.id)

              editor.createBinding({
                type: "fishWorldModel",
                fromId: fishId,
                toId: shape.id,
              })

            })
          }

        //   if(shape.type === 'concept'){
        //     console.log("TRANSLATION ENDED")
        //     const conceptParent = editor.getShapeParent(shape)

            
        // // calculate distance to other shapes in the kinematic canvas and change styling if close enough (use bindings here)
        //     if(conceptParent?.type === 'kinematicCanvas'){
        //       // TODO: inelegant, refactor later
        //       const allCanvasChildren = editor.getSortedChildIdsForParent(conceptParent).map(id => editor.getShape(id))
        //       const canvasChildren = editor.getSortedChildIdsForParent(conceptParent).filter(id => id !== shape.id).map(id => editor.getShape(id))

        //       // this version preserves local positioning, unlike the shape object given in onTranslateEnd
        //       const concept = editor.getSortedChildIdsForParent(conceptParent).filter(id => id === shape.id).map(id => editor.getShape(id))[0]

        //       // // tear down all activated concepts to recalculate distances
        //       // editor.updateShape({id: concept.id, type: 'concept', props: { activated: false }})
        //       // for(let child of canvasChildren){
        //       // 	if(child.type === 'concept' && child.props.activated){
        //       // 		editor.updateShape({id: child.id, type: child.type, props: { activated: false }})
        //       // 	}
        //       // }

        //       console.log("CHILDREN:", editor.getSortedChildIdsForParent(conceptParent).map(id => editor.getShape(id)))

        //       const distanceThreshold = 50;

        //       function calculateCenter(shape){
        //         console.log("SHAPE POSITION:", shape)
        //         const shapeX = shape.x + (shape.props.w / 2);
        //         const shapeY = shape.y + (shape.props.h / 2);

        //         return [shapeX, shapeY]
        //       }

        //       const [conceptX, conceptY] = calculateCenter(concept)

        //       console.log("CONCEPT POSITION:", conceptX, conceptY)

        //       // find object with minimum distance
        //       const distances = canvasChildren.map(child => {
        //         return {shape: child, distance: Math.sqrt(Math.pow(conceptX - calculateCenter(child)[0], 2) + Math.pow(conceptY - calculateCenter(child)[1], 2))}
        //       })

        //       const minDistanceShape = distances.reduce((closest, current) => {
        //         return current.distance < closest.distance ? current : closest;
        //       }, distances[0])

        //       if(minDistanceShape && minDistanceShape.distance < distanceThreshold){
        //         console.log("DISTANCE THRESHOLD:", minDistanceShape)
        //         // update shape parameter
        //         editor.updateShapes([
        //           {...minDistanceShape.shape, props: {
        //             ...minDistanceShape.shape.props,
        //             activated: true
        //           }},
        //           {...concept, props: {
        //             ...concept.props,
        //             activated: true
        //           }},

        //         ])



        //         const [encapCircleX, encapCircleY, encapCircleR] = getEncapsulatingCircle(concept, minDistanceShape.shape)

        //         console.log("CIRCLE DIMS", encapCircleX, encapCircleY)

        //         // convert circle coordinates to world space

        //         console.log("CONCEPT PARENT:", conceptParent)
        //         const worldEncapCircle = editor.getShapePageTransform(conceptParent.id).applyToPoint({x: encapCircleX, y: encapCircleY})
        //         // const worldEncapCircleX = editor.getShapePageTransform(conceptParent.id).applyToPoint(), worldEncapCircleY = conceptParent.y + encapCircleY
                
        //         function positionShapesOnCircle(centerX, centerY, radius, numShapes) {
        //           const positions = [];
        //           const angleStep = (2 * Math.PI) / numShapes;
                  
        //           for (let i = 0; i < numShapes; i++) {
        //             const angle = i * angleStep;
        //             const x = centerX + radius * Math.cos(angle);
        //             const y = centerY + radius * Math.sin(angle);
        //             positions.push({ x, y });
        //           }
                  
        //           return positions;
        //           }

        //         //   console.log("WORLD CIRCLE DIMS", worldEncapCircleX, worldEncapCircleY)

        //         // placeholder for database
        //         const conceptArray = [
        //           {
        //             props: {
        //               text: "concept one"
        //             }
        //           },
        //           {
        //             props: {
        //               text: "concept two"
        //             }
        //           }, 
        //           {
        //             props: {
        //               text: "concept 3"
        //             }
        //           }
        //         ] 

        //         const positions = positionShapesOnCircle(worldEncapCircle.x, worldEncapCircle.y, encapCircleR+80, conceptArray.length)
                  
        //         // generate and bind 3 provisional concepts based on this coordinate
        //         console.log("POSITIONS:", positions)

        //         conceptArray.map((el, idx) => {
        //           let shapeId = createShapeId()
        //           editor.createShape({
        //             id: shapeId,
        //             type: "concept",
        //             x: positions[idx].x, // convert to world space and convert from top left to center
        //             y: positions[idx].y, // convert to world space and convert from top left to center
        //             opacity: 0.5,
                    
        //             props: {
        //               text: JSON.stringify(el.props.text),
        //               temporary: true,
        //               colors: [...new Set([...concept.props.colors, ...minDistanceShape.shape.props.colors])],
        //             }
        //           })
        //           const shape = editor.getShape(shapeId)
        //           editor.reparentShapes([shape], conceptParent.id)
        //         })
        //       }

        //     }

        //     if(conceptParent?.type === 'media'){
        //       // get all children of parent
        //       const mediaChildren = editor.getSortedChildIdsForParent(conceptParent).map(id => editor.getShape(id))

        //       for(let mediaChild of mediaChildren){
        //         if(mediaChild.type === 'concept' && (mediaChild.props.text === shape.props.text) && mediaChild.id !== shape.id){
        //           editor.deleteShape(mediaChild.id)
        //         }
        //       }

        //     // check if there's a binding. if so update. if not, create.	
        //       const bindings = editor.getBindingsFromShape(shape, 'mediaConcept')

        //       console.log("BINDINGS:", bindings)
        //       if(bindings && bindings.some(e => e.toId === conceptParent.id)){
        //         const mediaBinding = bindings.find(e => e.toId ===  conceptParent.id)
        //         const endShape = editor.getShape(shape)

        //         console.log("UPDATE BINDING", endShape.x / conceptParent.props.w, shape.y / conceptParent.props.h)

        //         editor.updateBinding({id: mediaBinding.id, type: mediaBinding.type, props: {
        //           proportionX: endShape.x / conceptParent.props.w,
        //           proportionY: endShape.y / conceptParent.props.h,
        //         }})
        //       }
        //       else{
        //         console.log("CREATING BINDING")
        //         const endShape = editor.getShape(shape)
        //         editor.createBinding({
        //           type: 'mediaConcept',
        //           fromId: endShape.id,
        //           toId: conceptParent.id,
        //           props: {
        //             proportionX: endShape.x / conceptParent.props.w,
        //             proportionY: endShape.y / conceptParent.props.h,
        //           }
        //         })
        //       }
            
        //     }

        //   }

            // for(let mediaConcept of shape.props.concepts){
            //   let mediaConceptId = createShapeId();
            //   editor.createShape({
            //     id: mediaConceptId,
            //     type: mediaConcept.type,
            //     x: 0,
            //     y: 0,
            //     props: {
            //       text: mediaConcept.text,
            //     }
            //   })

            //   editor.reparentShapes([mediaConceptId], shape.id)

            //   editor.createBinding({
            //     type: "mediaConcept",
            //     fromId: mediaConceptId,
            //     toId: shape.id,
            //   })
            // }



          //   // const padding = 20
          //   // const minX = shape.x + padding, maxX = shape.x + shape.props.w - padding;
          //   // const minY = shape.y + padding, maxY = shape.y + shape.props.h - padding;
            
          //   // editor.batch(() => {
          //   //   const conceptShapes = shape.props.concepts.map((el) => {
          //   //     return(
          //   //       {
          //   //         id: createShapeId(),
          //   //         type: el.type,
          //   //         x: minX + Math.random() * (maxX - minX),
          //   //         y: minY + Math.random() * (maxY - minY),
          //   //         props: {
          //   //           text: el.text,
          //   //         }
          //   //       }
          //   //     )	
          //   //   })
  
          //   //   console.log("CONCEPT SHAPES:", conceptShapes)
  
          //   //   const createdShapes = editor.createShapes(conceptShapes)
  
          //   //   console.log("CREATED SHAPES:", createdShapes)
  
          //   //   editor.reparentShapes(conceptShapes, shape.id)
              
          //   // })

          // }  
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
