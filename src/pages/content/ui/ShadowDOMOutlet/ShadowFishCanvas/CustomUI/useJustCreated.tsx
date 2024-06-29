import { useState, useEffect } from 'react';
import { useValue } from "@tldraw/editor"

export function useResizeCreated(editor, shape) {
  const [justCreated, setJustCreated] = useState(false);
  const [transitionedToFalse, setTransitionedToFalse] = useState(false);


  const isCreating = useValue(
    'is creating this shape',
    () => {
      const resizingState = editor.getStateDescendant('select.resizing')
      if (!resizingState) return false
      if (!resizingState.getIsActive()) return false
      const info = (resizingState as typeof resizingState & { info: { isCreating: boolean } })
        ?.info
      if (!info) return false
      return info.isCreating && editor.getOnlySelectedShapeId() === shape.id
    },
    [shape.id]
  )


  useEffect(() => {
    if(isCreating === false && transitionedToFalse === false){
        setTransitionedToFalse(true)
    }
    }, [isCreating, transitionedToFalse])

    return transitionedToFalse
}
