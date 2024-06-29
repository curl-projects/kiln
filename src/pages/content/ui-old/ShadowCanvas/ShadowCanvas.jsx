import React, { useEffect, useState } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, useEditor } from 'tldraw';


function createShape(element, position){
    switch(element.props.name){
        case 'div':
            return {
                type: 'geo',
                x: position.x,
                y: position.y,
                props: {
                    geo: 'rectangle',
                }

            }
        case 'p': 
            return {

            }
        default: 
            console.warn("Unsupported Element Type", element)
            
            return {
                type: 'geo',
                x: position.x,
                y: position.y,
                props: {
                    geo: 'rectangle',
                }
            }
        
    }
}

function traverseReactElements(element, shapes = [], position = { x: 0, y: 0 }) {
    if (!element || typeof element !== 'object') return shapes;

    const { type, key, props } = element;
    const { children, ...otherProps } = props || {};


    shapes.push({
        id: key || `${type}-${shapes.length}`,
        type: 'geo',
        text: typeof element === 'string' ? element : type,
        x: position.x,
        y: position.y,
        props: { ...otherProps },
    });

    // Adjust position for stacking
    const nextPosition = { x: position.x, y: position.y + 30 };

    // Traverse children
    if (Array.isArray(children)) {
        children.forEach((child) => {
            traverseReactElements(child, shapes, nextPosition);
        });
    } 
    
    else if (typeof children === 'object') {
        traverseReactElements(children, shapes, nextPosition);
    } 
    
    else if (children) {
        shapes.push({
            id: `${type}-${shapes.length}-child`,
            type: 'text',
            text: children,
            x: nextPosition.x,
            y: nextPosition.y,
            props: {},
        });
    }

    return shapes;
}

export default function ShadowCanvas({ parsedContent }) {
    const editor = useEditor()
    const [store, setStore] = useState(() => {
        const newStore = createTLStore({ shapeUtils: defaultShapeUtils });
        return newStore;
    });

    // useEffect(()=>{
    //     editor.createShapes([{ id: 'box1', type: 'text', props: { text: 'ok' } }])
    // }, [])

    useEffect(() => {
        if(parsedContent && Object.keys(parsedContent).length !== 0){
            console.log("ATTEMPTING")
            const newStore = createTLStore({ shapeUtils: defaultShapeUtils });
            const collectedShapes = traverseReactElements(parsedContent);
            newStore.put(collectedShapes);
            setStore(newStore);
        }
    }, [parsedContent]);

    return (
        <Tldraw 
            store={store} 
            // persistenceKey="my-persistence-key" 
        />
    );
}
