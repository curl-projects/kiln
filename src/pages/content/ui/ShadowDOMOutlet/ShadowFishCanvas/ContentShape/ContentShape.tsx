import { useState, useEffect, useRef } from 'react';
import { TLBaseShape, ShapeProps, ShapeUtil, Geometry2d, HTMLContainer, Rectangle2d, T } from 'tldraw';

// Define the shape type and properties
export type ContentShape = TLBaseShape<
  'content',
  {
    w: number,
    h: number,
    content: string,
    contentType: string
  }
>

// Create the utility class for the ContentShape
export class ContentShapeUtil extends ShapeUtil<ContentShape> {
  static override type = 'content' as const
  static override props: ShapeProps<ContentShape> = {
    w: T.number,
    h: T.number,
    content: T.string,
    contentType: T.string,
  }

  override isAspectRatioLocked = (_shape: ContentShape) => false
  override canResize = (_shape: ContentShape) => true
  override canBind = (_shape: ContentShape) => true
  override hideSelectionBoundsFg = (_shape: ContentShape) => false
  override hideSelectionBoundsBg = (_shape: ContentShape) => false
  override hideResizeHandles = (_shape: ContentShape) => false
  override hideRotateHandle = (_shape: ContentShape) => true

  // Define the geometry for the shape
  getGeometry(shape: ContentShape): Geometry2d {
    return new Rectangle2d({
      width: shape.props.w,
      height: shape.props.h,
      isFilled: true,
    })
  }

  // Define the component to be rendered
  component(shape: ContentShape) {
    return <ResizableInput shape={shape} />;
  }

  // Define default properties for the shape
  getDefaultProps(): ContentShape['props'] {
    return {
      w: 200,
      h: 50,
      content: 'Type your text here...',
      contentType: 'paragraph',
    }
  }

  // Optionally, define an indicator if needed
  indicator(shape: ContentShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}

interface ResizableInputProps {
  shape: ContentShape;
}

const ResizableInput: React.FC<ResizableInputProps> = ({ shape }) => {
  const [content, setContent] = useState(shape.props.content);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(shape.props.content);
  }, [shape.props.content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    // Update the shape's properties as the user types
    shape.props.content = e.target.value;
    // shape.store.put([shape]);
  };

  return (
    <HTMLContainer id={shape.id}>
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={handleChange}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid black',
          color: "#898E87",
          fontSize: shape.props.contentType === 'header' ? '40px' : '20px',
          fontWeight: shape.props.contentType === 'header' ? 'bold' : 'normal',
          boxSizing: 'border-box',
        }}
      />
    </HTMLContainer>
  );
};
