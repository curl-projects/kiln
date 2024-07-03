import { EditorContent, useEditor } from '@tiptap/react';
import {
	HTMLContainer,
	stopEventPropagation,
} from '@tldraw/editor'
import { T, createShapeId } from 'tldraw';
import { useCallback, useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Node } from "@tiptap/core";
import Placeholder from '@tiptap/extension-placeholder'

const OneLiner = Node.create({
	name: "oneLiner",
	topNode: true,
	content: "block",
  });

export function SearchShapeConcept({ concept, editor, idx }) {
    const shape = editor.getShape({ id: concept.id, type: concept.type })
    const shapeRef = useRef();
    const buffer = 2
    const [isHovered, setIsHovered] = useState(false);

    console.log("SHAPE TEXT:", shape.props, shape.props.text)


    const textEditor = useEditor({
        extensions: [
            OneLiner,
            Paragraph,
            Text,
            Placeholder.configure({
                placeholder: "Unknown Concept"
            })
        ],
        content: shape.props.text ? shape.props.text : "Unknown",


        onUpdate: ({ editor: textEditor }) => {
            stopEventPropagation;
            const jsonContent = JSON.stringify(editor.getJSON())
            textEditor.updateShape({
                id: shape.id,
                type: 'concept',
                props: {
                    text: jsonContent,
                    w: (shapeRef.current?.clientWidth + buffer) || 100,
                    h: (shapeRef.current?.clientHeight + buffer) || 20,
                }
            })
        },

        onSelectionUpdate: ({ editor: textEditor }) => {
        }
    });

    useLayoutEffect(() => {
        if (textEditor && editor) {
            editor.updateShape({
                id: shape.id,
                type: 'concept',
                props: {
                    w: shapeRef.current.clientWidth + buffer,
                    h: shapeRef.current.clientHeight + buffer,
                }
            })
        }
    }, [textEditor, editor])


    return (
        <span
            key={idx}
            style={{
                pointerEvents: 'none',
                // display: 'flex',
                // justifyContent: 'center',
                // alignItems: 'center',
                height: 'fit-content',
                width: 'fit-content',
                position: 'relative',
                marginLeft: '4px',
                display: 'inline !important',
            }}
        >
            <div 
                style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    right: '-10px',
                    bottom: '-10px',
                    pointerEvents: 'all',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            <div style={{
                minHeight: "100%",
                minWidth: '100%',
                width: '100%',
                height: '100%',
                // display: 'inline-block', 
                boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
                pointerEvents: 'all',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                color: 'transparent'
            }}
                ref={shapeRef}
            >
                <div style={{
                    borderRadius: '100%',
                    backgroundImage: generateLinearGradient(shape.props.colors),
                    height: "14px",
                    width: '14px',
                    flexShrink: 0,
                }}
                />
                <EditorContent
                    editor={textEditor}
                    onKeyDown={stopEventPropagation}
                    className='tiptapConcept'
                    style={{
                        display: 'inline',
                        fontWeight: 550,
                        backgroundImage: generateLinearGradient(shape.props.colors),
                        backgroundClip: "text",
                        letterSpacing: '-0.00em',
                        lineHeight: '21px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                    }}
                />
                {isHovered && (
                    <IoMdClose style={{
                        marginLeft: '-6px',
                        cursor: 'pointer',
                        color: 'rgba(0, 0, 0, 0.8)',
                        fontWeight: 'bold',
                    }} />
                )}
            </div>
        </span>
    )
}


function generateLinearGradient(colors) {
	if (colors.length < 1) {
	  console.error('At least one color is required to create a gradient.');
	  return '';
	}
  
	if (colors.length === 1) {
	  // If there is only one color, create a gradient with the same color
	  return `linear-gradient(to right, ${colors[0]}, ${colors[0]})`;
	}
  
	const numColors = colors.length;
	const interval = 100 / (numColors - 1);
  
	let gradient = 'linear-gradient(to right, ';
	colors.forEach((color, index) => {
	  gradient += `${color} ${index * interval}%, `;
	});
	
	// Remove the trailing comma and space, and add closing parenthesis
	gradient = gradient.slice(0, -2) + ')';
	
	return gradient;
  }

