import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { useTipTap } from './useTipTap';
import { Loading } from "./Loading";
import { EditorContent, EditorOptions } from '@tiptap/react';
import { useEditableText } from './useEditableText';
import { TLShapeId } from "tldraw";

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
}

export const TipTap = memo((props: TipTapProps) => {
  const { toolbar = false } = props;
  const { handleChange } = useEditableText(props.id, props.type, props.content);
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: props.width, height: props.height });

  const { editor } = useTipTap(props, handleChange, size);

  useEffect(()=>{
    console.log("SIZE:", size)
  }, [size])
  

  const resizeEditor = useCallback(() => {
    if (ref.current) {
      const { offsetHeight, offsetWidth } = ref.current;
      console.log("REF CURRENT:", offsetHeight, offsetWidth, ref.current)
      const newSize = { width: offsetWidth, height: offsetHeight };
      setSize(newSize);
    }
  }, [ref.current]);

  useEffect(() => {
    if(editor && size){
      handleChange(editor.getHTML(), size);
    }
    
  }, [size, editor]);

  useEffect(() => {
    if (editor) {
      editor.on('update', resizeEditor);
      editor.commands.focus();
    }

    return () => {
      if (editor) {
        editor.off('update', resizeEditor);
      }
    };
  }, [editor, resizeEditor]);

  useEffect(() => {
    resizeEditor();
  }, [props.content, resizeEditor]);

  if (!editor) {
    return <Loading />;
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        // display: 'flex',
        overflow: 'visible',
        // justifyContent: 'flex-start',
        boxSizing: "border-box",
        lineHeight: `${props.fontSize * props.lineHeight}px`,
        // minHeight: 8,
        // minHeight: `${props.fontSize * props.lineHeight + 32}px`,
        // minWidth: props.width || 0,
        // width: 'fit-content',
        // height: 'fit-content',
        border: '2px solid black',
        // padding: '10px',
        // padding: '1rem', // Replacing Tailwind with inline style
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
});
