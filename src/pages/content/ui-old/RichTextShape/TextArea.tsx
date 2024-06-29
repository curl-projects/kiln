import { preventDefault, stopEventPropagation } from '@tldraw/editor'
import { forwardRef } from 'react'
import ContentEditable from 'react-contenteditable'

interface TextAreaProps {
  isEditing: boolean
  text: string
  handleFocus: () => void
  handleBlur: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleInputPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
  handleDoubleClick: (e: any) => any
}

export const TextArea = forwardRef<HTMLDivElement, TextAreaProps>(function TextArea(
  {
    isEditing,
    text,
    handleFocus,
    handleChange,
    handleKeyDown,
    handleBlur,
    handleInputPointerDown,
    handleDoubleClick,
  },
  ref
) {
  return (
    <ContentEditable
      innerRef={ref}
      className="tl-text tl-text-input"
      html={text}
      style={{
        height: 'fit-content',
      }}
      disabled={!isEditing}
      onFocus={handleFocus}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onTouchEnd={stopEventPropagation}
      onContextMenu={isEditing ? stopEventPropagation : undefined}
      onPointerDown={handleInputPointerDown}
      onDoubleClick={handleDoubleClick}
      onDragStart={preventDefault}
    />
  )
})
