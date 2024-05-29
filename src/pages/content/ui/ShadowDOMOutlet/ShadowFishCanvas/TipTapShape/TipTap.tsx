import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
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

  useEffect(() => {
    if (editor && props.isEditing) {
      editor.commands.focus();
    }
  }, [props.isEditing, editor]);

  const resizeEditor = useCallback(() => {
    if (editor) {
      const dom = editor.view.dom;
      const newSize = { width: dom.scrollWidth, height: dom.scrollHeight };
      setSize(newSize);
    }
  }, [editor]);

  useEffect(() => {
    if (editor && size) {
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
  <EditorContent ref={ref} editor={editor} />
  );
});
