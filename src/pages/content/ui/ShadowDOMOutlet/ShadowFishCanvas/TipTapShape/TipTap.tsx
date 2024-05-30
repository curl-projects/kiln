import React, { memo, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useTipTap } from './useTipTap';
import { Loading } from "./Loading";
import { EditorContent, EditorOptions } from '@tiptap/react';
import { useEditableText } from './useEditableText';
import { TLShapeId } from "tldraw";
import { ResizableBox } from 'react-resizable';
import { stopEventPropagation } from '@tldraw/editor'; 
import { useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';

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
}

export const TipTap = memo((props: TipTapProps) => {
  const { toolbar = false } = props;
  const { handleChange } = useEditableText(props.id, props.type, props.content);
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: props.width, height: props.height });

  // useLayoutEffect(()=>{
  //   if(editor){
  //     handleChange(editor.getHTML(), size);
  //   }
    
  // }, [size])


  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      // FishHighlight,
      // Placeholder.configure({
      //   placeholder: 'Start typing...',
      // }),
        // Add your custom extension here
      // ...extensions,
    ],
    content: props.content,

    // editorProps: {
    //   attributes: {
    //     // class: `prose prose-sm prose-zinc dark:prose-invert w-full h-full p-4 focus:outline-none !max-w-full ${className}`,
    //   },
    // },
    onUpdate: ({ editor }) => {
      console.log("handling change!")
      const dom = editor.view.dom;
      const newSize = { width: dom.scrollWidth + 12, height: dom.scrollHeight + 12 };
      console.log("handling change! New size:", newSize)
      handleChange(editor.getHTML(), { width: dom.scrollWidth + 12, height: dom.scrollHeight + 12 });
    },

    // ...rest,
  });

  // const { editor } = useTipTap(props, handleChange, size);

  useEffect(() => {
    // stopEventPropagation;
    if (editor && props.isEditing) {
      const dom = editor.view.dom;
      // handleChange(editor.getHTML(), { width: dom.scrollWidth + 14, height: dom.scrollHeight + 14 });
      editor.commands.focus();
      // stopEventPropagation;
    }
  }, [props.isEditing, editor]);

  // const resizeEditor = useCallback(() => {
  //   if (editor) {
  //     const dom = editor.view.dom;
  //     console.log("DOM:", dom)
  //     const newSize = { width: dom.scrollWidth + 12, height: dom.scrollHeight + 12 };
  //     setSize(newSize);
  //   }
  // }, [editor]);

  // useLayoutEffect(() => {
  //   if (editor && size) {
  //     handleChange(editor.getHTML(), size);
  //   }
  // }, [size, editor]);

  // useLayoutEffect(() => {
  //   if (editor) {
  //     editor.on('update', resizeEditor);
  //     editor.commands.focus();
  //   }

  //   return () => {
  //     if (editor) {
  //       editor.off('update', resizeEditor);
  //     }
  //   };
  // }, [editor, resizeEditor]);

  // useLayoutEffect(() => {
  //   resizeEditor();
  // }, [props.content, resizeEditor]);

  if (!editor) {
    return <Loading />;
  }

  function handleResize(){
    console.log("RESIZING!")
  }

  return (
    // <ResizableBox onResize={handleResize}
    //   style={{
    //     border: '2px solid pink',
    //     // textWrap: props.isEditing ? "unset" : 'wrap',
    // }}>
      <EditorContent 
        ref={ref} 
        editor={editor} 
        onPointerDown={props.isEditing ? stopEventPropagation : undefined}
        className='tiptapParent' 
        style={{
          border: "2px solid red", 
          // height: `${props.height}px`,
          // width: `${props.width}px`,
          minWidth: 0, 
          minHeight: 0, 
          boxSizing: 'border-box',
          // whiteSpace: 'pre-wrap'
          whiteSpace: props.justCreated ? "unset" : 'pre-line',

        }}/>
    // </ResizableBox>
  );
});

