
import { createShapeId, TLClickEventInfo, TLTextShape } from '@tldraw/editor';

export function handleDoubleClickOnCanvas(info: TLClickEventInfo) {
	// Create text shape and transition to editing_shape
    console.log("DOUBLE CLCIK")

	if (this.editor.getInstanceState().isReadonly) return


	this.editor.mark('creating media text shape')
	const id = createShapeId()
	const { x, y } = this.editor.inputs.currentPagePoint

    function worldModelFishMode(shape){
        if(shape.type === 'fish'){
        const worldModelBinding = this.editor.getBindingsFromShape(shape, 'fishWorldModel')[0]
        const worldModel: any = worldModelBinding ? this.editor.getShape(worldModelBinding.toId) : undefined

        return worldModel && worldModel.props.viewMode === 'fish'
        }
        else{
            return false
        }

        
    }

    // check if there's a selected fish
    const selectedShapes = this.editor.getSelectedShapes();       

    // if a fish has been 
    if(selectedShapes.some(selectedShape => {
        return worldModelFishMode(selectedShape)
    })){
        for(let selectedShape of selectedShapes){
            if(worldModelFishMode(selectedShape)){
                this.editor.updateShape({
                    id: selectedShape.id,
                    type: selectedShape.type,
                    props: {
                        destination: {
                            x: x,
                            y: y,
                        }
                    }
                })
            }
        }
    }
    else{
    // otherwise, summon all fish with worldModels in viewMode 'fish'

        const currentPage = this.editor.getCurrentPage();
        const allShapeIds = this.editor.getPageShapeIds(currentPage);

        for(let shapeId of allShapeIds){
            const shape = this.editor.getShape(shapeId)


            console.log("SHAPE:", shape)
            if(shape.type === 'fish'){
                // check if selected

                const worldModelBinding = this.editor.getBindingsFromShape(shape, 'fishWorldModel')[0]
                const worldModel: any = worldModelBinding ? this.editor.getShape(worldModelBinding.toId) : undefined

                if(worldModel && worldModel.props.viewMode === 'fish'){
                    this.editor.updateShape({
                        id: shape.id,
                        type: shape.type,
                        props: {
                            destination: {
                                x: x,
                                y: y,
                            }
                        }
                    })
                }
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

