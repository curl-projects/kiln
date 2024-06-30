
import { createShapeId, TLClickEventInfo, TLTextShape } from '@tldraw/editor';

export function handleDoubleClickOnCanvas(info: TLClickEventInfo) {
	// Create text shape and transition to editing_shape
    console.log("DOUBLE CLCIK")

	if (this.editor.getInstanceState().isReadonly) return


	this.editor.mark('creating media text shape')
	const id = createShapeId()
	const { x, y } = this.editor.inputs.currentPagePoint

    const currentPage = this.editor.getCurrentPage();
    const allShapeIds = this.editor.getPageShapeIds(currentPage);

    for(let shapeId of allShapeIds){
        const shape = this.editor.getShape(shapeId)


        console.log("SHAPE:", shape)
        if(shape.type === 'fish'){

            this.editor.updateShape({
                id: shape.id,
                type: shape.type,
                props: {
                    destination: {
                        x: 100,
                        y: 100,
                    }
                }
            })
            console.log("FISH")
            // this.editor.animateShape({
            //     id: shape.id,
            //     type: shape.type,
            //     x: 100, 
            //     y: 100,
            // }, {
            //     animation: {
            //         duration: 1000,
            //         ease: (t) => t * t
            //     }
            // })
        }
    }

    // SUMMON ALL FISH


	// this.editor
	// 		.createShapes([
	// 			{
	// 				id,
	// 				type: 'media',
	// 				x,

	// 				y,
	// 				props: {
	// 					text: JSON.stringify("Untitled"),
	// 				},
	// 			},
	// 		])
	// 		.select(id)
	
	// this.editor.setEditingShape(id)
	
	// this.editor.root.getCurrent()?.transition('editing_shape')
	
	// this.editor.setCurrentTool('select')
}

