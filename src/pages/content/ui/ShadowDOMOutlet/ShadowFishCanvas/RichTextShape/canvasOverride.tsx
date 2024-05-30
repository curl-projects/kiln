// import { createShapeId } from '@tldraw/editor';

// // 

// export function handleDoubleClickOnCanvas(info, parent) {
//   console.log("THIS EDITOR:", this.editor);
//   // Create text shape and transition to editing_shape
//   if (this.editor.getInstanceState().isReadonly) return;

//   this.editor.mark('creating richText shape');

//   const id = createShapeId();

//   const { x, y } = this.editor.inputs.currentPagePoint;


//   this.editor.createShapes([
//     {
//       id,
//       type: 'richText',
//       x,
//       y,
//       props: {
//         text: '',
//         autoSize: true,
//       },
//     },
//   ]);

//   const shape = this.editor.getShape(id);
//   console.log("SHAPE:", shape);
//   if (!shape) return;

//   const util = this.editor.getShapeUtil(shape);
//   if (this.editor.getInstanceState().isReadonly) {
//     if (!util.canEditInReadOnly(shape)) {
//       return;
//     }
//   }

//   this.editor.setEditingShape(id);
  
//   this.editor.select(id);
//   console.log("THIS PARENT", this.parent)
//   this.parent.transition('editing_shape', info);
// }


import { createShapeId, TLClickEventInfo, TLTextShape } from '@tldraw/editor';

export function handleDoubleClickOnCanvas(info: TLClickEventInfo) {
	// Create text shape and transition to editing_shape
	if (this.editor.getInstanceState().isReadonly) return

	this.editor.mark('creating richText text shape')
	const id = createShapeId()
	const { x, y } = this.editor.inputs.currentPagePoint
	this.editor
			.createShapes([
				{
					id,
					type: 'richText',
					x,
					y,
					props: {
						text: '',
						autoSize: true,
					},
				},
			])
			.select(id)
	
	this.editor.setEditingShape(id)
	
	this.editor.root.getCurrent()?.transition('editing_shape')
	
	this.editor.setCurrentTool('select')

	// this.editor.createShapes([
	// 	{
	// 		id,
	// 		type: 'richText',
	// 		x,
	// 		y,
	// 		props: {
	// 			text: '',
	// 			autoSize: true,
	// 		},
	// 	},
	// ])

	// const shape = this.editor.getShape(id)
	// if (!shape) return

	// const util = this.editor.getShapeUtil(shape)
	// if (this.editor.getInstanceState().isReadonly) {
	// 	if (!util.canEditInReadOnly(shape)) {
	// 		return
	// 	}
	// }

	// this.editor.setEditingShape(id)
	// this.editor.select(id)
	// this.parent.transition('editing_shape', info)
}

