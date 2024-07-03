import { createShapeId } from "tldraw"
import { useRef } from 'react';


export function FeedCard({result, idx, editor, worldModel}){
    const ref = useRef();

    return(
        <div key={idx}
        ref={ref}
        onClick={(e)=>{
            console.log("DRAG START!", e)
            console.log("DRAG START 2!", e.target.getBoundingClientRect())
            const { x, y } = editor.inputs.currentPagePoint

            const clickX = e.clientX, clickY = e.clientY
            const rect = ref.current.getBoundingClientRect();
            const distanceX = clickX - rect.left, distanceY = clickY - rect.top
            const shapeId = createShapeId()

            console.log("DISTANCE:", e.target.clientHeight)
            editor.createShape({
                    id: shapeId,
                    type: 'media',
                    x: x-distanceX,
                    y: y-distanceY,
                    props: {
                        w: ref.current.clientWidth,
                        h: ref.current.clientHeight,
                        url: result.url || "",
                        title: result.title || "",
                        // text: JSON.stringify("Hey")
                        text: result.simulatedMedia
                    }
                })
            // editor.reparentShapes([shapeId], worldModel.id)

            // this.editor.updateShape({
            //     id: shapeId,
            //     type: 'media',
            //     x: 
            // })

            editor.setCurrentTool('select.pointing_shape', { shape: editor.getShape(shapeId)})


                // editor.setSelectedShapes([shapeId])
                // // editor.setEditingId(editor.onlySelectedShape.id)
                // editor.root.current.value.transition('editing_shape', {target: 'shape', id: shapeId, shape: editor.getShape(shapeId)})
             
                // editor.setEditingShape(shapeId)
                // editor.setCurrentTool('select.pointing_shape', { shape: editor.getShape(shapeId) })
                // const currentTool = editor.getCurrentTool();
                // currentTool.transition('translating', currentTool.info)
                
                
                
            // editor.setCurrentTool('select')
            // editor.setCurrentTool('select.rd', { shape: editor.getShape(shapeId) })
        
        
        }}
        style={{    
            backgroundColor: '#FFFFFF', 
            boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
            borderRadius: '12px',
            pointerEvents: 'all',	
            border: "1px solid rgba(255, 255, 255, 0.95)",
            padding: '28px 24px',
            cursor: 'pointer',
        }}>
            <div style={{
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <svg style={{ flexShrink: 0}} width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.36588 1.59401C2.8065 1.59401 0.731709 3.66881 0.731709 6.22819C0.731709 8.78754 2.8065 10.8623 5.36588 10.8623C7.92528 10.8623 10.0001 8.78754 10.0001 6.22819C10.0001 3.66881 7.92528 1.59401 5.36588 1.59401ZM0 6.22819C0 3.26469 2.40239 0.862305 5.36588 0.862305C8.32935 0.862305 10.7318 3.26469 10.7318 6.22819C10.7318 9.19168 8.32935 11.5941 5.36588 11.5941C2.40239 11.5941 0 9.19168 0 6.22819Z" fill="#191400" fillOpacity="0.207843"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2444 6.55373H0.488281V5.90332H10.2444V6.55373Z" fill="#191400" fillOpacity="0.207843"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.04005 11.1064V1.35021H5.69046V11.1064H5.04005ZM7.70274 6.22827C7.70274 4.46181 7.06748 2.71427 5.8221 1.5588L6.20918 1.1416C7.59266 2.42516 8.27185 4.33619 8.27185 6.22827C8.27185 8.12037 7.59266 10.0314 6.20918 11.315L5.8221 10.8977C7.06748 9.7423 7.70274 7.99475 7.70274 6.22827ZM2.51953 6.22829C2.51953 4.33894 3.17658 2.4289 4.51791 1.14467L4.91148 1.55575C3.70532 2.71057 3.08864 4.45908 3.08864 6.22829C3.08865 7.9975 3.70534 9.74604 4.9115 10.9008L4.51792 11.3119C3.1766 10.0277 2.51954 8.11765 2.51953 6.22829Z" fill="#191400" fillOpacity="0.207843"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.3641 3.34863C7.12778 3.34863 8.92131 3.67476 10.137 4.3539C10.2742 4.43054 10.3233 4.60389 10.2467 4.7411C10.1701 4.87829 9.99668 4.92739 9.85952 4.85075C8.76204 4.2377 7.07795 3.91774 5.3641 3.91774C3.65023 3.91774 1.96616 4.2377 0.868689 4.85075C0.731485 4.92739 0.558134 4.87829 0.481492 4.7411C0.404857 4.60389 0.453947 4.43054 0.591151 4.3539C1.80692 3.67476 3.6004 3.34863 5.3641 3.34863ZM5.3641 8.95191C7.12778 8.95191 8.92131 8.62573 10.137 7.94662C10.2742 7.86999 10.3233 7.69663 10.2467 7.55943C10.1701 7.42223 9.99668 7.37314 9.85952 7.44977C8.76204 8.06282 7.07795 8.3828 5.3641 8.3828C3.65023 8.3828 1.96616 8.06282 0.868689 7.44978C0.731485 7.37314 0.558134 7.42223 0.481492 7.55943C0.404857 7.69663 0.453947 7.86999 0.591151 7.94662C1.80692 8.62573 3.6004 8.95191 5.3641 8.95191Z" fill="#191400" fillOpacity="0.207843"/>
                </svg>
                <p style={{
                margin: 0,
                color: "#82827C", 
                fontSize: '12px',
                fontStyle: 'italic',
                textTransform: 'capitalize',
                fontWeight: '460',
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                maxWidth: "90%",
                textDecoration: "none",
                }}><a target="_blank" href={result.url} style={{color: "#82827C" }}>{result.title}</a></p>
            </div>
            <div style={{
                overflow: 'hidden',
                maxHeight: '200px',
            }}>
                <p style={{
                    fontWeight: 500,
                    color: "#63635E",
                    letterSpacing: '-0.00em',
                    lineHeight: '21px',
                    fontSize: '14px',
                }}>{result.simulatedMedia}</p>
            </div>
        </div>
    )
}