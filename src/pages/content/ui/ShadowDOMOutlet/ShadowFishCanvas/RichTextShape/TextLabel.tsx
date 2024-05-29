import React, { useEffect, useState } from 'react'
import { Box, TLDefaultFillStyle, TLDefaultFontStyle, TLDefaultHorizontalAlignStyle, TLDefaultVerticalAlignStyle, TLShapeId } from '@tldraw/editor'
import { TextArea } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/TextArea'
import { TextHelpers } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/TextHelpers'
import { isLegacyAlign } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/shared/legacyProps'
import { useEditableText } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/useEditableText'

interface TextLabelProps {
  id: TLShapeId
  type: string
  font: TLDefaultFontStyle
  fontSize: number
  lineHeight: number
  fill?: TLDefaultFillStyle
  align: TLDefaultHorizontalAlignStyle
  verticalAlign: TLDefaultVerticalAlignStyle
  wrap?: boolean
  text: string
  labelColor: string
  bounds?: Box
  isNote?: boolean
  isSelected: boolean
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  classNamePrefix?: string
  style?: React.CSSProperties
  textWidth?: number
  textHeight?: number
}

export const TextLabel = React.memo(function TextLabel({
  id,
  type,
  text,
  labelColor,
  font,
  fontSize,
  lineHeight,
  align,
  verticalAlign,
  wrap,
  isSelected,
  onKeyDown: handleKeyDownCustom,
  classNamePrefix,
  style,
  textWidth,
  textHeight,
}: TextLabelProps) {
  const { rInput, isEmpty, isEditing, isEditingAnything, handleChange, ...editableTextRest } = useEditableText(
    id,
    type,
    text
  )

  const [initialText, setInitialText] = useState(text)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '@') {
      setDropdownVisible(true)
    } else {
      setDropdownVisible(false)
    }

    if (handleKeyDownCustom) {
      handleKeyDownCustom(e)
    }
  }

  useEffect(() => {
    if (!isEditing) setInitialText(text)
  }, [isEditing, text])

  const finalText = TextHelpers.normalizeTextForDom(text)
  const hasText = finalText.length > 0

  const legacyAlign = isLegacyAlign(align)

  if (!isEditing && !hasText) {
    return null
  }

  const cssPrefix = classNamePrefix || 'tl-text'
  return (
    <div
      className={`${cssPrefix}-label tl-text-wrapper`}
      data-font={font}
      data-align={align}
      data-hastext={!isEmpty}
      data-isediting={isEditing}
      data-iseditinganything={isEditingAnything}
      data-textwrap={!!wrap}
      data-isselected={isSelected}
      style={{
        justifyContent: align === 'middle' || legacyAlign ? 'center' : align,
        alignItems: verticalAlign === 'middle' ? 'center' : verticalAlign,
        ...style,
      }}
    >
      <div
        className={`${cssPrefix}-label__inner tl-text-content__wrapper`}
        style={{
          fontSize,
          lineHeight: fontSize * lineHeight + 'px',
          minHeight: lineHeight + 32,
          minWidth: textWidth || 0,
          width: textWidth,
          height: textHeight,
          fontFamily: "HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif",
          color: "#7F847D",
          fontWeight: '550',
        }}
      >
        <div className={`${cssPrefix} tl-text tl-text-content`} dir="auto">
			<div dangerouslySetInnerHTML={{ __html: finalText }} />
          {/* {finalText.split('\n').map((lineOfText, index) => (
            <div key={index} dir="auto">
              {lineOfText}
            </div>
          ))} */}
        </div>
        {(isEditingAnything || isSelected) && (
          <>
            <TextArea
              ref={rInput}
              key={initialText}
              text={text}
              isEditing={isEditing}
              handleChange={handleChange}
              {...editableTextRest}
              handleKeyDown={handleKeyDown}
              dropdownVisible={dropdownVisible}
              setDropdownVisible={setDropdownVisible}
            />
          </>
        )}
      </div>
    </div>
  )
})
