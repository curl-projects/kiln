/* eslint-disable react-hooks/rules-of-hooks */

import { HTMLContainer, TLBaseShape, useIsEditing } from 'tldraw';
// import { EditingIndicator } from '@/components';
import { TipTap } from "./TipTap"
import { FlowNodeUtil } from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/TipTapShape/FlowNode"


export type TipTapNode = TLBaseShape<
  'tiptap',
  {
    w: number;
    h: number;
    text: string;
  }
>;

export class TipTapShapeUtil extends FlowNodeUtil<TipTapNode> {
  static override type = 'tiptap' as const;
  override canScroll = () => true;

  getDefaultProps(): TipTapNode['props'] {
    return {
      w: 385,
      h: 300,
      text: '',
    };
  }

  component(node: TipTapNode) {
    const isEditing = useIsEditing(node.id);
    return (
      <HTMLContainer id={node.id} style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        height: '100%',
        overflow: 'hidden',
        fontSize: '0.75rem',
        cursor: 'auto',

      }} >
        <TipTap content={node.props.text} />
        {/* <EditingIndicator isEditing={isEditing} /> */}
      </HTMLContainer>
    );
  }

//   panelPreview(node: TipTapNode) {
//     return (
//       <div className='relative p-1 flex flex-col gap-1 w-full h-full justify-center items-center text-primary text-base overflow-hidden'>
//         <IconSetCache.Logos.TipTap className="w-full h-auto px-2" />
//       </div>
//     );
//   }

// //   getSchema(node: TipTapNode) {
//     const baseSchema = super.getSchema(node);
//     const baseSchemaProps = filterObjectByKeys(baseSchema.props.fields, Object.keys(node.props));
//     return {
//       ...baseSchema,
//       props: yup.object().shape({
//         ...baseSchemaProps,
//       }).meta({ item: 'object' }),
//     }
//   }
}