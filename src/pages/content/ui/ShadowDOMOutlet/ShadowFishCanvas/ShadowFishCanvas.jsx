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
          console.log("ERROR", error)
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

      editor.registerExternalContentHandler('text', async ({ point, sources }) => {
        const htmlSource = sources?.find((s) => s.type === 'text')
  
        if (htmlSource) {
          const center = point ?? editor.getViewportPageBounds().center
  
          editor.createShape({
            type: 'media',
            x: center.x+250,
            y: center.y,
            props: {
              view: 'concepts',
              text: htmlSource.data,
              plainText: htmlSource.data,
            },
          })
        }
      })
      
  

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

              editor.reparentShapes([searchId], shape.id)

              editor.createBinding({
                type: "searchFeedBinding",
                fromId: searchId,
                toId: shape.id,
              })

            })
          }
          if(shape.type === 'media'){
            if(shape.props.text !== ""){

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
