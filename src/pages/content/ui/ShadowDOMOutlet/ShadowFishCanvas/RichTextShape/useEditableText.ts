import {
	TLShapeId,
	TLUnknownShape,
	getPointerInfo,
	stopEventPropagation,
	useEditor,
	useValue,
  } from '@tldraw/editor'
  import React, { useCallback, useEffect, useRef } from 'react'
  import { INDENT, TextHelpers } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/TextHelpers'
  
  /** @public */
  export function useEditableText(id: TLShapeId, type: string, text: string) {
	const editor = useEditor()
	const rInput = useRef<HTMLDivElement>(null)
	const isEditing = useValue('isEditing', () => editor.getEditingShapeId() === id, [editor])
	const isEditingAnything = useValue('isEditingAnything', () => !!editor.getEditingShapeId(), [
	  editor,
	])
  
	useEffect(() => {
	  function selectAllIfEditing({ shapeId }: { shapeId: TLShapeId }) {
		if (shapeId === id) {
		  const element = rInput.current
		  if (element) {
			const range = document.createRange()
			range.selectNodeContents(element)
			const selection = window.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
		  }
		}
	  }
  
	  editor.on('select-all-text', selectAllIfEditing)
	  return () => {
		editor.off('select-all-text', selectAllIfEditing)
	  }
	}, [editor, id, isEditing])
  
	useEffect(() => {
	  if (!isEditing) return
  
	  if (document.activeElement !== rInput.current) {
		rInput.current?.focus()
	  }
  
	  if (editor.getInstanceState().isCoarsePointer) {
		const element = rInput.current
		if (element) {
		  const range = document.createRange()
		  range.selectNodeContents(element)
		  const selection = window.getSelection()
		  selection.removeAllRanges()
		  selection.addRange(range)
		}
	  }
  
	  if (editor.environment.isSafari) {
		rInput.current?.blur()
		rInput.current?.focus()
	  }
	}, [editor, isEditing])
  
	const handleKeyDown = useCallback(
	  (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (editor.getEditingShapeId() !== id) return
  
		switch (e.key) {
		  case 'Enter': {
			if (e.ctrlKey || e.metaKey) {
			  editor.complete()
			}
			break
		  }
		}
	  },
	  [editor, id]
	)
  
	const handleChange = useCallback(
	  (e: React.ChangeEvent<HTMLDivElement>) => {
		if (editor.getEditingShapeId() !== id) return
  
		let text = TextHelpers.normalizeText(e.target.value)
		text = text.replace(/@fish/g, '<span style="color:pink;">@fish</span>')
  
		editor.updateShape<TLUnknownShape & { props: { text: string } }>({
		  id,
		  type,
		  props: { text },
		})
	  },
	  [editor, id, type]
	)
  
	const handleInputPointerDown = useCallback(
	  (e: React.PointerEvent) => {
		editor.dispatch({
		  ...getPointerInfo(e),
		  type: 'pointer',
		  name: 'pointer_down',
		  target: 'shape',
		  shape: editor.getShape(id)!,
		})
  
		stopEventPropagation(e)
	  },
	  [editor, id]
	)
  
	return {
	  rInput,
	  handleFocus: noop,
	  handleBlur: noop,
	  handleKeyDown,
	  handleChange,
	  handleInputPointerDown,
	  handleDoubleClick: stopEventPropagation,
	  isEmpty: text.trim().length === 0,
	  isEditing,
	  isEditingAnything,
	}
  }
  
  function noop() {
	return
  }
  