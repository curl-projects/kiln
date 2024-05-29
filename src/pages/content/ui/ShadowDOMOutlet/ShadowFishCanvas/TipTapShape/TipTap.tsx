import { useEffect, useRef } from 'react';
import { useTipTap } from './useTipTap';
import { Loading } from "./Loading";
import { cn } from './cn';
import { EditorContent, EditorOptions } from '@tiptap/react';
import { Suspense, memo, useRef } from 'react';

export interface TipTapProps extends Partial<EditorOptions> {
  children?: any;
  content?: string;
  className?: string;
  extensions?: any[];
  toolbar?: boolean;
}

export const TipTap = memo((props: TipTapProps) => {
  const {
    toolbar = false,
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { editor } = useTipTap(props);

  useEffect(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return <Loading />;
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        border: '1px solid black', // Assuming '--border-primary-color' is defined in your CSS variables
        borderRadius: '0.125rem', // Assuming this corresponds to `rounded-sm`
        backgroundColor: 'green', // Assuming '--bg-secondary-color' is defined in your CSS variables
      }}
    >
      <Suspense fallback={<Loading />}>
        {/* {toolbar && <TipTapToolbar editor={editor}/>} */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: 'fit-content',
            height: 'fit-content',
            overflowY: 'auto',
            overflowX: 'hidden',
            justifyContent: 'center',
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </Suspense>
    </div>
  );
});
