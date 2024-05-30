import React, { memo, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useTipTap } from './useTipTap';
import { Loading } from "./Loading";
import { EditorContent, EditorOptions } from '@tiptap/react';
import { useEditableText } from './useEditableText';
import { TLShapeId } from "tldraw";
import { ResizableBox } from 'react-resizable';
import { stopEventPropagation } from '@tldraw/editor'; 

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
  const [resizableSize, setResizableSize] = useState({ width: props.width, height: props.height });

  useLayoutEffect(() => {
    setResizableSize({ width: props.width, height: props.height });
  }, [props.width, props.height]);

  const { editor } = useTipTap(props, handleChange, size);

  useLayoutEffect(() => {
    if (editor && props.isSelected) {
      editor.commands.focus();
      stopEventPropagation;
    }
  }, [props.isSelected, editor]);

  const resizeEditor = useCallback(() => {
    if (editor) {
      const dom = editor.view.dom;
      const newSize = { width: dom.scrollWidth + 8, height: dom.scrollHeight + 8 };
      setSize(newSize);
    }
  }, [editor]);

  useLayoutEffect(() => {
    if (editor && size) {
      handleChange(editor.getHTML(), size);
    }
  }, [size, editor]);

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
    resizeEditor();
  }, [props.content, resizeEditor]);

  if (!editor) {
    return <Loading />;
  }

  return (
    <ResizableBox height={resizableSize.height} width={resizableSize.width} 
      style={{
        border: '2px solid red',
        // textWrap: props.isEditing ? "unset" : 'wrap',
    }}>
      <EditorContent ref={ref} editor={editor}/>
    </ResizableBox>
  );
});
