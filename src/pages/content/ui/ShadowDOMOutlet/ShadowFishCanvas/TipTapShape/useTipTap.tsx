import { useEditor } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TipTapProps } from './TipTap';
import { useCallback } from 'react';

export interface useTipTapProps extends Partial<TipTapProps> {}

export const useTipTap = (props: useTipTapProps, handleChange: any, size: any) => {
  const {
    children,
    content = '',
    className,
    extensions = [],
    ...rest
  } = props;

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      ...extensions,
    ],
    content: children || content,
    editorProps: {
      attributes: {
        class: `prose prose-sm prose-zinc dark:prose-invert w-full h-full p-4 focus:outline-none !max-w-full ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      // console.l og("UPDATE!",)
      handleChange(editor.getHTML(), size);
    },
    ...rest,
  });

  const updateContent = useCallback(
    (content: string) => {
      editor?.commands.setContent(content);
    },
    [editor]
  );

  const setColor = useCallback(
    (color: string = '#FFFFFF') => {
      editor?.commands.setColor(color);
    },
    [editor]
  );

  const addVideo = (videoUrl: string) => editor?.commands.setVideo(videoUrl);

  const getCounts = useCallback(() => {
    const characters = editor?.storage?.characterCount?.characters();
    const words = editor?.storage?.characterCount?.words();
    return { characters, words };
  }, [editor]);

  const getLinkAttributes = useCallback(() => editor?.getAttributes('link').href, [editor]);

  const getText = useCallback(() => editor?.getText(), [editor]);
  const getHTML = useCallback(() => editor?.getHTML(), [editor]);
  const getJSON = useCallback(() => editor?.getJSON(), [editor]);
  const getMarkdown = useCallback(() => editor?.storage?.markdown?.getMarkdown(), [editor]);

  const getAll = useCallback(
    () => ({
      ...editor?.storage,
      meta: {
        counts: getCounts(),
        linkAttributes: getLinkAttributes(),
        text: getText(),
        html: getHTML(),
        json: getJSON(),
        markdown: getMarkdown(),
      },
    }),
    [editor?.storage, getCounts, getHTML, getJSON, getLinkAttributes, getMarkdown, getText]
  );

  return {
    editor,
    updateContent,
    setColor,
    addVideo,
    getCounts,
    getLinkAttributes,
    getText,
    getHTML,
    getJSON,
    getAll,
  };
};
