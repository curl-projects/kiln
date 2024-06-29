import {
	areAnglesCompatible,
	Matrix2d,
	PI,
	PI2,
	SelectionCorner,
	SelectionEdge,
	TAU,
	Vec2d,
	VecLike,
} from '@tldraw/primitives'

import { TLShape, TLShapeId, TLShapePartial } from '@tldraw/tlschema'

type ShapeSnapshot = any

export default function customCreateSnapshot() {
    const {
        inputs: { originPagePoint },
    } = this.editor

    const selectedIds = this.editor.getSelectedShapeIds();
    const selectedShapeIds = this.editor.getSelectedShapeIds();
    const selectionRotation = this.editor.getSelectionRotation();


    const selectionBounds = this.editor.getSelectionPageBounds()

    const dragHandlePoint = Vec2d.RotWith(
        selectionBounds.getHandlePoint(this.info.handle!),
        selectionBounds.point,
        selectionRotation
    )

    const cursorHandleOffset = Vec2d.Sub(originPagePoint, dragHandlePoint)

    const shapeSnapshots = new Map<TLShapeId, ShapeSnapshot>()
    console.log("SELECTED IDS:", selectedIds)
    selectedIds.forEach((id) => {
        const shape = this.editor.getShape(id)
        if (shape) {
            shapeSnapshots.set(shape.id, this._createShapeSnapshot(shape))
            if ((['worldModel', 'frame', 'media'].includes(shape.type)) && selectedIds.length === 1) return
            this.editor.visitDescendants(shape.id, (descendantId) => {
                const descendent = this.editor.getShape(descendantId)
                if (descendent) {
                    shapeSnapshots.set(descendent.id, this._createShapeSnapshot(descendent))
                    if (['worldModel', 'frame', 'media'].includes(descendent.type)) {
                        return false
                    }
                }
            })
        }
    })

    const canShapesDeform = ![...shapeSnapshots.values()].some(
        (shape) =>
            !areAnglesCompatible(shape.pageRotation, selectionRotation) || shape.isAspectRatioLocked
    )

    return {
        shapeSnapshots,
        selectionBounds,
        cursorHandleOffset,
        selectionRotation,
        selectedIds,
        selectedShapeIds,
        canShapesDeform,
        initialSelectionPageBounds: this.editor.selectedPageBounds!,
    }
}
