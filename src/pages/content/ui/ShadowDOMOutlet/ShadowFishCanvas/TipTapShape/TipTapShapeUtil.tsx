import { HTMLContainer, TLBaseShape, useIsEditing, useEditor, toDomPrecision } from 'tldraw';

import {
  WeakMapCache,
  Editor,
  Rectangle2d,
  Vec,
  TLOnEditEndHandler,
  ShapeUtil,
  TLShapeUtilFlag,
  TLOnResizeHandler,
  stopEventPropagation,
} from '@tldraw/editor';
import { useEditableText } from './useEditableText';

import { TipTap } from './TipTap';
import { useCallback, useState, useEffect } from 'react';
import {
  FONT_FAMILIES,
  FONT_SIZES,
  TEXT_PROPS,
} from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/shared/default-shape-constants';
import { resizeScaled } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/shared/resizeScaled';

export type TipTapNode = TLBaseShape<
  'tiptap',
  {
    w: number;
    h: number;
    text: string;
    autoSize: boolean;
    fontSize: number;
    scale: number;
    align: string;
    size: string;
    font: string;
    resizeW: number;
    resizeH: number;
  }
>;

export function useSizeState() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  return { size, setSize };
}

// const sizeCache = new WeakMapCache<TipTapNode['props'], { width: number, height: number }>();

export class TipTapShapeUtil extends ShapeUtil<TipTapNode> {
  static override type = 'tiptap' as const;
  // override canScroll = () => true;
  override canEdit = () => true;

  // override isAspectRatioLocked: TLShapeUtilFlag<TipTapNode> = () => true;

  getDefaultProps(): TipTapNode['props'] {
    return {
      w: 14,
      h: 14,
      text: '',
      autoSize: true,
      fontSize: 14,
      scale: 1,
      align: 'start',
      size: 'm',
      font: 'draw',
      resizeH: 8,
      resizeW: 8,
    };
  }

  // getMinDimensions(shape: TipTapNode) {
  //   return sizeCache.get(shape.props, (props) => getTextSize(this.editor, props));
  // }

  getGeometry(shape: TipTapNode) {
    const { scale } = shape.props;
    // console.log("GEOMETRY DIMS:", s`hape.props.w, shape.props.h)
    // const { width, height } = this.getMinDimensions(shape)!;
    // console.log("WIDTH:", width, "HEIGHT:", height)
    return new Rectangle2d({
      width: shape.props.w * scale,
      height: shape.props.h * scale,
      isFilled: true,
      isLabel: true,
    });
  }

  override onEditEnd: TLOnEditEndHandler<TipTapNode> = shape => {
    // console.log('EDIT END!');
    const {
      id,
      type,
      props: { text },
    } = shape;
    const trimmedText = text.trimEnd();

    if (trimmedText.length === 0) {
      this.editor.deleteShapes([shape.id]);
    } else {
      if (trimmedText !== text) {
        this.editor.updateShapes([
          {
            id,
            type,
            props: {
              text: trimmedText,
            },
          },
        ]);
      }
    }
  };

  // override onBeforeUpdate = (prev: TipTapNode, next: TipTapNode) => {
  //     console.log("BEFORE UPDATE!")
  // //   if (!next.props.autoSize) return;

  //   const styleDidChange =
  //     prev.props.size !== next.props.size ||
  //     prev.props.align !== next.props.align ||
  //     prev.props.font !== next.props.font ||
  //     (prev.props.scale !== 1 && next.props.scale === 1);

  //   const textDidChange = prev.props.text !== next.props.text;

  //   if (!styleDidChange && !textDidChange) return;

  //   const boundsA = this.getMinDimensions(prev);
  //   const boundsB = getTextSize(this.editor, next.props);

  //   const wA = boundsA.width * prev.props.scale;
  //   const hA = boundsA.height * prev.props.scale;
  //   const wB = boundsB.width * next.props.scale;
  //   const hB = boundsB.height * next.props.scale;

  //   let delta: Vec | undefined;

  //   switch (next.props.align) {
  //     case 'middle': {
  //       delta = new Vec((wB - wA) / 2, textDidChange ? 0 : (hB - hA) / 2);
  //       break;
  //     }
  //     case 'end': {
  //       delta = new Vec(wB - wA, textDidChange ? 0 : (hB - hA) / 2);
  //       break;
  //     }
  //     default: {
  //       if (textDidChange) break;
  //       delta = new Vec(0, (hB - hA) / 2);
  //       break;
  //     }
  //   }

  //   if (delta) {
  //     delta.rot(next.rotation);
  //     const { x, y } = next;
  //     return {
  //       ...next,
  //       x: x - delta.x,
  //       y: y - delta.y,
  //       props: { ...next.props, w: wB, h: hB },
  //     };
  //   } else {
  //     return {
  //       ...next,
  //       props: { ...next.props, w: wB, h: hB },
  //     };
  //   }
  // }

  override onDoubleClickEdge = (shape: TipTapNode) => {
    if (!shape.props.autoSize) {
      return {
        id: shape.id,
        type: shape.type,
        props: {
          autoSize: true,
        },
      };
    }

    if (shape.props.scale !== 1) {
      return {
        id: shape.id,
        type: shape.type,
        props: {
          scale: 1,
        },
      };
    }
  };

  component(shape: TipTapNode) {
    const [justCreated, setJustCreated] = useState(true);
    const { handleChange, handleInputPointerDown } = useEditableText(shape.id, 'tiptap', shape.props.text);
    // const isEditing = useIsEditing(shape.id);
    const isEditing = this.editor.getEditingShapeId() === shape.id;
    const isSelected = shape.id === this.editor.getOnlySelectedShapeId();

    // this.editor.store.listen((change) => {
    //   console.log("CHANGE")
    //   for (const record of Object.values(change.changes.added)) {
    //     if (record.typeName === 'shape') {
    //         console.log(`inner created shape (${record.type})\n`)
    //         if(record.id === shape.id){
    //             setJustCreated(true)
    //         }
    //     }
    //    }
    // })

    useEffect(() => {
      if (!isEditing) {
        // console.log('NO LONGER EDITING');
        setJustCreated(false);
      }
    }, [isEditing, setJustCreated]);

    // useEffect(() => {
    //   console.log('JUST CREATED!', justCreated);
    // }, [justCreated]);

    // console.log('IS EDITING:', isEditing);
    // console.log('IS SELECTED:', isSelected);
    // console.log('SHAPE HEIGHT:', shape.props.h, 'SHAPE WIDTH:', shape.props.w);

    return (
      <div
        id={shape.id}
        style={{
          position: 'relative',
          display: 'grid',
          height: `${shape.props.h}px`,
          width: `${shape.props.w}px`,
          boxSizing: 'border-box',
          overflow: 'visible',
          fontSize: '20px',
          border: '2px solid green',
          whiteSpace: 'nowrap',
          fontFamily: "HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif",
          fontWeight: 550,
          pointerEvents: 'none'

          // whiteSpace: isEditing ? 'nowrap' : 'pre-wrap',

          // wordWrap: 'normal',
          // overflowWrap: 'anywhere',
          // whiteSpace: (isEditing ) ? "nowrap" : 'pre-wrap',
        }}>
        <TipTap
          id={shape.id}
          type="tiptap"
          content={shape.props.text}
          handleChange={handleChange}
          isEditing={isEditing}
          isSelected={isSelected}
          width={shape.props.w}
          height={shape.props.h}
          fontSize={shape.props.fontSize}
          lineHeight={TEXT_PROPS.lineHeight}
          justCreated={justCreated}
        />
      </div>
    );
  }

  indicator(shape: TipTapNode) {
    // console.log("SHAPE DIMS:", shape.props.w, shape.props.h)

    const bounds = this.editor.getShapeGeometry(shape).bounds;

    // console.log("BOUNDS:", bounds)
    const editor = useEditor();
    //   if (shape.props.autoSize && editor.getEditingShapeId() === shape.id) return null;
    return <rect width={toDomPrecision(bounds.width)} height={toDomPrecision(bounds.height)} />;
  }

  override onResize: TLOnResizeHandler<TipTapNode> = (shape, info) => {
    // console.log('\n');
    // console.log('RESIZING HAPPENING!', info);

    const { newPoint, initialBounds, initialShape, scaleX, scaleY, handle } = info;

    // if (info.mode === 'scale_shape' || (handle !== 'right' && handle !== 'left')) {
    //   return {
    //     id: shape.id,
    //     type: shape.type,
    //     ...resizeScaled(shape, info),
    //   };
    // } else {
    const nextWidth = Math.max(1, Math.abs(initialBounds.width * scaleX));
    const nextHeight = Math.max(1, Math.abs(initialBounds.height * scaleY));

    // console.log('NEXT WIDTH:', nextWidth, 'NEXT HEIGHT:', nextHeight);
    const { x, y } = scaleX < 0 ? Vec.Sub(newPoint, Vec.FromAngle(shape.rotation).mul(nextWidth)) : newPoint;

    return {
      id: shape.id,
      type: shape.type,
      x,
      y,
      props: {
        w: nextWidth / initialShape.props.scale,
        h: nextHeight / initialShape.props.scale,
      },
    };
    // }
  };
}

function getTextSize(editor: Editor, props: TipTapNode['props']) {
  const { text, autoSize, w } = props;
  const minWidth = autoSize ? 16 : Math.max(16, w);
  const fontSize = 14;

  const cw = autoSize ? null : Math.floor(Math.max(minWidth, w));

  const result = editor.textMeasure.measureText(text, {
    ...TEXT_PROPS,
    fontFamily:
      'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif',
    fontSize: fontSize,
    maxWidth: cw,
  });

  if (autoSize) {
    result.w += 1;
  }

  return {
    width: Math.max(minWidth, result.w),
    height: Math.max(fontSize, result.h),
  };
}
