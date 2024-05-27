import {
	createShapeId,
} from '@tldraw/editor'

export function handleDoubleClickOnCanvas(editor, parent, info){
    // Create text shape and transition to editing_shape
    if (editor.getInstanceState().isReadonly) return

    editor.mark('creating text shape')

    const id = createShapeId()

    const { x, y } = editor.inputs.currentPagePoint

    editor.createShapes([
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

    const shape = editor.getShape(id)
    if (!shape) return

    const util = editor.getShapeUtil(shape)
    if (editor.getInstanceState().isReadonly) {
        if (!util.canEditInReadOnly(shape)) {
            return
        }
    }

    editor.setEditingShape(id)
    editor.select(id)
    parent.transition('editing_shape', info)
}