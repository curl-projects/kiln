import React, { memo, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useTipTap } from './useTipTap';
import { Loading } from './Loading';
import { EditorContent, EditorOptions } from '@tiptap/react';
import { useEditableText } from './useEditableText';
import { TLShapeId } from 'tldraw';
import { ResizableBox } from 'react-resizable';
import { stopEventPropagation } from '@tldraw/editor';
import { useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
// import Mention from '@tiptap/extension-mention'
import suggestion, { CustomMention } from './customExtensions/suggestion'

export interface TipTapProps extends Partial<EditorOptions> {
  children?: any;
  content?: string;
  className?: string;
  extensions?: any[];
  toolbar?: boolean;
  isEditing?: boolean;
  width: number;
  height: number;
  fontSize: number;
  lineHeight: number;
  id: TLShapeId;
  type: string;
  isSelected?: any;
  justCreated: any;
  handleChange: any;
  fishConfig: any;
}

export const TipTap = memo((props: TipTapProps) => {
  const { toolbar = false } = props;
  const ref = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      CustomMention.configure({
        HTMLAttributes: {
          class: 'mention',
          style: {
            border: '1px solid pink',
          }
        },
        suggestion: {
          ...suggestion,
          items: ({ query }) => {
            return [
              ...props.fishConfig.map(e => e.name),
              'everyone'
            ]
              .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
              .slice(0, 5)
          } 
        },
      
      }),
    ],
    content: props.content,

    // editorProps: {
    //   attributes: {
    //     class: `goals-extension-editor`,
    //   },
    // },
    onUpdate: ({ editor }) => {
      // console.log("UPDATE:")
      stopEventPropagation;
    },
    onSelectionUpdate: ({ editor }) => {
      stopEventPropagation;
    }
  });

  // const { editor } = useTipTap(props, handleChange, size);

 
  const resizeEditor = useCallback(() => {
    if(editor){
      const dom = editor.view.dom;
      // console.log("RESIZE:", dom.scrollWidth, dom.scrollHeight)
      props.handleChange(editor.getHTML(), editor.getText(), { width: dom.scrollWidth + 13, height: dom.scrollHeight + 12 });
    }
  }, [editor])

  useLayoutEffect(() => {
    if(editor){
      editor.on('update', resizeEditor);
    }

    if(!props.isSelected){
      resizeEditor();
    }
  }, [editor, props.isSelected, resizeEditor]);

  useEffect(() => {
    if (editor && props.isEditing) {
      // console.log("CHANGED",)
      stopEventPropagation;
      const dom = editor.view.dom;
      editor.commands.focus();
      
    }

    if(editor && props.isSelected && !props.isEditing){
      editor.commands.blur();
    }
  }, [props.isEditing, editor, props.isSelected]);

  if (!editor) {
    return <Loading />;
  }


  return (
    <EditorContent
      ref={ref}
      editor={editor}
      className="tiptapParent"
      style={{
        border: '2px solid red',
        pointerEvents: 'all',
        // height: `${props.height}px`,
        // width: `${props.width}px`,
        minWidth: 0,
        minHeight: 0,
        height: props.justCreated ? 'fit-content' : 'unset',
        width: props.justCreated ? 'fit-content' : 'unset',
        boxSizing: 'border-box',
        overflow: 'visible',
        // overflowY: 'visible',
        // whiteSpace: 'pre-wrap'
        whiteSpace: props.justCreated ? 'unset' : 'pre-line',
      }}
    />
  );
});


// export default HighlightExtension;

// import { Mark, mergeAttributes } from '@tiptap/core'

// export const Highlight = Mark.create({
//   name: 'highlight',

//   addOptions() {
//     return {
//       multicolor: false,
//       HTMLAttributes: {},
//     }
//   },

//   addAttributes() {
//     return {
//       color: {
//         default: 'pink',
//         renderHTML: attributes => {
//           return { style: `background-color: ${attributes.color}` }
//         },
//         parseHTML: element => ({
//           color: element.style.backgroundColor,
//         }),
//       },
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'span[style*="background-color"]',
//         getAttrs: node => node.style.backgroundColor === this.options.HTMLAttributes.style.backgroundColor,
//       },
//     ]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
//   },
// })

// // Function to apply highlight to 'finn'
// export function applyHighlight(editor) {
//   const transaction = editor.state.tr;
//   let hasChange = false;

//   editor.state.doc.descendants((node, pos) => {
//     if (node.isText) {
//       const regex = /\b(finn)(\s|\b|,|\.|!|\?)/gi; // Adjusted to match spaces or punctuation after "finn"
//       let match;
//       let lastIndex = 0;

//       while ((match = regex.exec(node.text)) !== null) {
//         const start = pos + match.index;
//         const end = start + match[1].length; // Adjust to apply only to "finn"

//         if (!editor.state.doc.rangeHasMark(start, end, editor.schema.marks.highlight)) {
//           if (lastIndex !== match.index) {
//             transaction.addMark(start, end, editor.schema.marks.highlight.create({ color: 'pink' }));
//             hasChange = true;
//           }
//         }
//         lastIndex = match.index + match[0].length;
//       }
//     }
//   });

//   if (hasChange) {
//     editor.view.dispatch(transaction);
//   }
// }

// // Example usage
// // Create your Tiptap editor instance and register the Highlight extension
// // editor.registerExtension(Highlight)
// // Then you can use applyHighlight(editor) whenever you want to color 'finn'
