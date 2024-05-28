import {
	Box,
	TLDefaultFillStyle,
	TLDefaultFontStyle,
	TLDefaultHorizontalAlignStyle,
	TLDefaultVerticalAlignStyle,
	TLShapeId,

} from '@tldraw/editor'
import React, { useEffect, useState } from 'react'

import { TextArea } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/TextArea'
import { TextHelpers } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/shared/TextHelpers'
import { isLegacyAlign } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/shared/legacyProps'
import { useEditableText } from '@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/RichTextShape/shapes/shared/useEditableText'

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
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
	classNamePrefix?: string
	style?: React.CSSProperties
	textWidth?: number
	textHeight?: number
}

/** @public */
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
	const { rInput, isEmpty, isEditing, isEditingAnything, ...editableTextRest } = useEditableText(
		id,
		type,
		text
	)

	const [initialText, setInitialText] = useState(text)

	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [dropdownItems] = useState(['Item1', 'Item2', 'Item3']);
	const [autoFillText, setAutoFillText] = useState('');

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === '@') {
			setDropdownVisible(true);
		} else {
			setDropdownVisible(false);
		}
	
		if (handleKeyDownCustom) {
			handleKeyDownCustom(e);
		}
	};

	const handleItemClick = (item: string) => {
		console.log("HI! ITEM CLICK")
		setAutoFillText(item);
		setDropdownVisible(false);
		console.log(`Selected item: ${item}`);
	};
	
	


	useEffect(() => {
		if (!isEditing) setInitialText(text)
	}, [isEditing, text])

	const finalText = TextHelpers.normalizeTextForDom(text)
	const hasText = finalText.length > 0

	const legacyAlign = isLegacyAlign(align)

	if (!isEditing && !hasText) {
		return null
	}

	// TODO: probably combine tl-text and tl-arrow eventually
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
					// color: labelColor,
					width: textWidth,
					height: textHeight,
					fontFamily: "HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif",
					color: "#7F847D",
					fontWeight: '550',
				}}
			>
				<div className={`${cssPrefix} tl-text tl-text-content`} dir="auto">
				
					{finalText.split('\n').map((lineOfText, index) => (
						<div key={index} dir="auto">
							{lineOfText}
						</div>
					))}
				</div>
				{(isEditingAnything || isSelected) && (
					<TextArea
						ref={rInput}
						// We need to add the initial value as the key here because we need this component to
						// 'reset' when this state changes and grab the latest defaultValue.
						key={initialText}
						text={text}
						isEditing={isEditing}
						{...editableTextRest}
						handleKeyDown={handleKeyDown}
					/>
				)}
			</div>
			{isEditingAnything && dropdownVisible && (
        	<div className="dropdown-menu">
				{dropdownItems.map((item, index) => (
					<div key={index} onClick={() => handleItemClick(item)}>
					{item}
					</div>
				))}
			</div>
			)}
		</div>
	)
})


const styles = {
	dropdownMenu: {
		
	}
}