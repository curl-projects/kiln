import {
	BaseBoxShapeUtil,
	Geometry2d,
	Rectangle2d,
	SVGContainer,
	SvgExportContext,
	TLGroupShape,
	getPointerInfo,
	TLOnResizeHandler,
	TLShape,
	canonicalizeRotation,
	frameShapeMigrations,
	frameShapeProps,
	T,
	invLerp,
	TLBaseShape,
	getDefaultColorTheme,
	resizeBox,
	toDomPrecision,
	useValue,
	HTMLContainer,
	stopEventPropagation,
	createShapeId,
} from '@tldraw/editor'
import { Expand } from '@tldraw/utils'

import { useCallback, useState, useEffect } from 'react'
import classNames from 'classnames'
import { createTextJsxFromSpans } from './shared/createTextJsxFromSpans'
import { useDefaultColorTheme } from './shared/useDefaultColorTheme'
import { WorldModelHeading } from './WorldModelHeading'
import { WorldModelControlButton } from './WorldModelControlButton';

export function last<T>(arr: readonly T[]): T | undefined {
	return arr[arr.length - 1]
}
export function defaultEmptyAs(str: string, dflt: string) {
	if (str.match(/^\s*$/)) {
		return dflt
	}
	return str
}
export const worldModelShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	name: T.string,
	minimized: T.boolean,
	storedW: T.number,
	storedH: T.number,
}

export type RecordPropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
	[K in keyof Config]: T.TypeOf<Config[K]>
}>

export type TLWorldModelShapeProps = RecordPropsType<typeof worldModelShapeProps>

/** @public */
export type TLWorldModelShape = TLBaseShape<'worldModel', TLWorldModelShapeProps>



/** @public */
export class WorldModelShapeUtil extends BaseBoxShapeUtil<TLWorldModelShape> {
	static override type = 'worldModel' as const
	static override props = worldModelShapeProps
	static override migrations = frameShapeMigrations

	override canEdit = (shape) => {
		return shape.props.minimized ? false : true
	}

	override canBind(){
		return true
	}

	override canResize = (shape) => {
		return shape.props.minimized ? false : true
	}

	override canCrop = () => true

	override getDefaultProps(): TLWorldModelShape['props'] {
		return { w: 160 * 2, h: 90 * 2, name: '', minimized: false, storedW: 160 * 2, storedH: 90 * 2}
	}

	override getGeometry(shape: TLWorldModelShape): Geometry2d {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: false,
		})
	}

	override component(shape: TLWorldModelShape) {
		const [selectedOutput, setSelectedOutput] = useState(null);
		const [viewType, setViewType] = useState("media")

		const bounds = this.editor.getShapeGeometry(shape).bounds
		const selectedShapes = this.editor.getSelectedShapeIds();

		const frameIsAncestor = selectedShapes.some(selectedShape => this.editor.hasAncestor(selectedShape, shape.id))
		const frameIsSelected = selectedShapes.includes(shape.id)

		useEffect(()=>{
			// trigger all media objects within the world model to switch form when viewType changes
			const children = this.editor.getSortedChildIdsForParent(shape).map(id => this.editor.getShape(id))

			for(let child of children){
				if(child.type === 'media'){
					this.editor.updateShape({id: child.id, type: child.type, props: { view: viewType }})
				}
			}
			
		}, [viewType])

		useEffect(()=>{
			console.log("MINIMIZED?", shape.props.minimized)

			const children = this.editor.getSortedChildIdsForParent(shape).map(id => this.editor.getShape(id))

			// if minimized, hide all children
			if(shape.props.minimized){
				for(let child of children){
					this.editor.updateShape({id: child.id, type: child.type, isLocked: true, opacity: 0})
				}
				this.editor.updateShape(
					{id: shape.id, type: shape.type, props: {
					storedW: shape.props.w,
					storedH: shape.props.h,
					w: 270,
					h: 160,
				}})
			}
			else{
				for(let child of children){
					this.editor.updateShape({id: child.id, type: child.type, isLocked: false, opacity: 1})
				}
				this.editor.updateShape({id: shape.id, type: shape.type, props: {
					w: shape.props.storedW,
					h: shape.props.storedH,
				}})
			}
		}, [shape.props.minimized])


		useEffect(()=>{
			if(!(frameIsSelected || frameIsAncestor)){
				// hide canvas when another option is suppressed
				const children: any = this.editor.getSortedChildIdsForParent(shape).map(id => this.editor.getShape(id))
				for(let child of children){
					if(child.type === 'kinematicCanvas'){
						this.editor.updateShape({...child, opacity: 0, isLocked: true})
					}
				}
			}
			else{
				const children: any = this.editor.getSortedChildIdsForParent(shape).map(id => this.editor.getShape(id))
				for(let child of children){
					if(child.type === 'kinematicCanvas'){
						this.editor.updateShape({...child, opacity: 1, isLocked: false})
					}
				}
			}
		}, [frameIsAncestor, frameIsSelected])

		// eslint-disable-next-line react-hooks/rules-of-hooks
		const isCreating = useValue(
			'is creating this shape',
			() => {
				const resizingState = this.editor.getStateDescendant('select.resizing')
				if (!resizingState) return false
				if (!resizingState.getIsActive()) return false
				const info = (resizingState as typeof resizingState & { info: { isCreating: boolean } })
					?.info
				if (!info) return false
				return info.isCreating && this.editor.getOnlySelectedShapeId() === shape.id
			},
			[shape.id]
		)

		useEffect(() => {
			if(selectedOutput === 'manipulate'){
				const children: any = this.editor.getSortedChildIdsForParent(shape).map(id => this.editor.getShape(id))

				// if no kinematic canvas exists
				if(!children.some(child => child.type === 'kinematicCanvas')){

					// create it
					const kinematicCanvasId = createShapeId();
					this.editor.createShape({
						id: kinematicCanvasId,
						type: "kinematicCanvas",
						x: shape.x+shape.props.w+80,
						y: shape.y,
						props: {
							w: 400,
							h: shape.props.h,
						}
					})

					this.editor.reparentShapes([kinematicCanvasId], shape.id)

					// bind it to the world model using the kinematic canvas binding util
					this.editor.createBinding({
						type: "kinematicCanvas",
						fromId: kinematicCanvasId,
						toId: shape.id,
					})
				}
				
			}

			else{
				
				// delete canvas when another option is suppressed
				const children: any = this.editor.getSortedChildIdsForParent(shape).map(id => this.editor.getShape(id))
				for(let child of children){
					if(child.type === 'kinematicCanvas'){
						this.editor.deleteShape(child)
					}
				}
			}
		}, [selectedOutput])

		useEffect(()=>{
			console.log("IS CREATING WORLD MODEL:", isCreating)
		}, [isCreating])
	
		return (
			<HTMLContainer 
				style={{
					position: 'relative', 
					boxSizing: 'border-box'}} 
				
				onPointerDown={stopEventPropagation}>
				<SVGContainer style={{}}>
					<defs>
						<filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
						<feDropShadow dx="0" dy="36" stdDeviation="21" floodColor="#4D4D4D" floodOpacity="0.15"/>
						</filter>
					</defs>
					<rect
						className={classNames({ 'tl-frame__creating': isCreating })}
						width={bounds.width}
						height={bounds.height}
						rx="12"
						ry="12"
						fill="#F9F9F8"
						strokeWidth="2"
						stroke="#DDDDDA"
						filter="url(#boxShadow)"

					/>
				</SVGContainer>
				<p 
				onPointerDown={()=>this.editor.updateShape({id: shape.id, type: shape.type, props: { minimized: !shape.props.minimized }})}
				style={{
					margin: 0,
					padding: 0,
					position: 'absolute',
					pointerEvents: "all",
					top: "0px",
					left: shape.props.w,
					transform: "translate(-200%, -10%)",
					display: 'flex',
					alignContent: 'center',
					justifyContent: 'center',
					fontSize: '40px',
					cursor: 'pointer',
					}}>{shape.props.minimized ? "+" : "-"}</p>
				{!shape.props.minimized && 
					<div style={{
						position: 'absolute',
						pointerEvents: "all",
						bottom: "0px",
						left: shape.props.w,
						transform: "translate(-100%, 0%)",
						height: 'fit-content',
						width: "100px",
						display: 'flex',
						alignContent: 'center',
						justifyContent: 'center',
						gap: '12px',
						paddingBottom: '10px',
						paddingRight: '10px',
					}}>
						<div 
						onPointerDown={()=>setViewType('media')}
						className='tl-kiln-transition-control' style={{
							height: '38px',
							width: '38px',
							borderRadius: '8px',
							border: viewType === 'media' ? '2px solid #63635E' : "2px solid #E8E7E9",
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							cursor: 'pointer',
						}}>
							<div style={{
								height: '8px',
								width: '8px',
								backgroundColor: viewType === 'media' ? "#636353" : "#D0CED4",
								borderRadius: "100%"
							}}/>

						</div>
						<div 
						onPointerDown={()=>setViewType('concepts')}
						className='tl-kiln-transition-control' style={{
							height: '38px',
							width: '38px',
							borderRadius: '8px',
							border: viewType === 'concepts' ? '2px solid #63635E' : "2px solid #E8E7E9",
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							cursor: 'pointer',
						}}>
							<div style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								height: '26px',
								width: '26px',
								border: viewType === 'concepts' ? "1.5px solid #63635E" : "1.5px solid #D0CED4",
								borderRadius: '100%',
							}}>
								<div style={{
									height: '8px',
									width: '8px',
									backgroundColor: viewType === 'concepts' ? "#63635E" : "#D0CED4",
									borderRadius: "100%"
								}}/>
							</div>

						</div>

					</div>
				}
				{isCreating  ? null : (
					<WorldModelHeading
						id={shape.id}
						name={shape.props.name}
						width={bounds.width}
						height={bounds.height}
						minimized={shape.props.minimized}
					/>
				)}
				{(!shape.props.minimized && !isCreating && (frameIsSelected || frameIsAncestor)) &&
					<div 
					onPointerDown={stopEventPropagation}
					className={classNames('tl-worldModel-controls')} style={{
						position: 'absolute',
						pointerEvents: "all",
						height: bounds.height,
						width: '400px',
						border: "2px solid pink",
						right: 0,
						transform: "translateX(100%)", 
						display: 'flex',
						flexDirection: 'row',
						zIndex: 10000,
					}}>
						<div
						onPointerDown={stopEventPropagation}
						className='tl-worldModel-controlColumn' style={{
							paddingLeft: "8px",
							paddingRight: "16px",
							display: 'flex',
							zIndex: 10000,
							flexDirection: 'column',
							gap: '16px',
						}}>
							{[
								{
									title: 'manipulate',
									icon: <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M7.44725 13.0326C6.8266 11.9576 5.27497 11.9576 4.65431 13.0326L2.381 16.9701C1.76035 18.0451 2.53616 19.3889 3.77747 19.3889H8.3241C9.5654 19.3889 10.3412 18.0451 9.72056 16.9701L7.44725 13.0326Z" fill="#D0CED4" stroke="#D0CED4" strokeWidth="0.6"/>
											<path d="M14.7949 2.53262C14.1743 1.45762 12.6226 1.45762 12.002 2.53262L9.72865 6.47012C9.108 7.54512 9.88382 8.88887 11.1251 8.88887H15.6718C16.9131 8.88887 17.6889 7.54512 17.0682 6.47012L14.7949 2.53262Z" fill="#D0CED4" stroke="#D0CED4" strokeWidth="0.6"/>
											<path d="M22.1465 13.0326C21.5258 11.9576 19.9742 11.9576 19.3535 13.0326L17.0802 16.9701C16.4596 18.0451 17.2354 19.3889 18.4767 19.3889H23.0233C24.2646 19.3889 25.0404 18.0451 24.4198 16.9701L22.1465 13.0326Z" fill="#D0CED4" stroke="#D0CED4" strokeWidth="0.6"/>
										</svg>,
									activeIcon: <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M9.89377 16.8701L7.62045 12.9326C6.92282 11.7243 5.17874 11.7243 4.48111 12.9326L2.20779 16.8701C1.51016 18.0785 2.3822 19.5889 3.77747 19.5889H8.3241C9.71936 19.5889 10.5914 18.0784 9.89377 16.8701Z" fill="#D0CED4" stroke="#63635E"/>
										<path d="M17.2414 6.37012L14.9681 2.43262C14.2705 1.22428 12.5264 1.22429 11.8288 2.43262L9.55545 6.37012C8.85782 7.57845 9.72986 9.08887 11.1251 9.08887H15.6718C17.067 9.08887 17.9391 7.57845 17.2414 6.37012Z" fill="#D0CED4" stroke="#63635E"/>
										<path d="M24.593 16.8701L22.3197 12.9326C21.622 11.7243 19.878 11.7243 19.1803 12.9326L16.907 16.8701C16.2094 18.0785 17.0814 19.5889 18.4767 19.5889H23.0233C24.4186 19.5889 25.2906 18.0784 24.593 16.8701Z" fill="#D0CED4" stroke="#63635E"/>
									</svg>	
								},
								{
								    title: "discover",
									icon: <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
											<mask id="path-1-inside-1_23_16709" fill="white">
											<path fillRule="evenodd" clipRule="evenodd" d="M5.59936 18.5435V16.7369H5.59803L7.75058 9.56632L5.09948 0.567383L0.335938 16.7369H4.32894V18.5435H5.59936ZM17.3116 16.7369H17.3136V18.5435H18.584V16.7369H22.6671L17.903 0.567383L15.2153 9.68926L17.3116 16.7369ZM11.4458 0.567834L16.2099 16.7373H12.1268V20.7119H10.8564V16.7373H6.68169L11.4458 0.567834Z"/>
											</mask>
											<path fillRule="evenodd" clipRule="evenodd" d="M5.59936 18.5435V16.7369H5.59803L7.75058 9.56632L5.09948 0.567383L0.335938 16.7369H4.32894V18.5435H5.59936ZM17.3116 16.7369H17.3136V18.5435H18.584V16.7369H22.6671L17.903 0.567383L15.2153 9.68926L17.3116 16.7369ZM11.4458 0.567834L16.2099 16.7373H12.1268V20.7119H10.8564V16.7373H6.68169L11.4458 0.567834Z" fill="#D0CED4"/>
											<path d="M5.59936 16.7369H7.02244V15.3138H5.59936V16.7369ZM5.59936 18.5435V19.9665H7.02244V18.5435H5.59936ZM5.59803 16.7369L4.23504 16.3277L3.68502 18.16H5.59803V16.7369ZM7.75058 9.56632L9.11357 9.97547L9.23525 9.57013L9.11565 9.16417L7.75058 9.56632ZM5.09948 0.567383L6.46456 0.165231L5.09948 -4.4684L3.73441 0.165231L5.09948 0.567383ZM0.335938 16.7369L-1.02913 16.3347L-1.56685 18.16H0.335938V16.7369ZM4.32894 16.7369H5.75201V15.3138H4.32894V16.7369ZM4.32894 18.5435H2.90586V19.9665H4.32894V18.5435ZM17.3136 16.7369H18.7367V15.3138H17.3136V16.7369ZM17.3116 16.7369L15.9476 17.1426L16.2502 18.16H17.3116V16.7369ZM17.3136 18.5435H15.8905V19.9665H17.3136V18.5435ZM18.584 18.5435V19.9665H20.0071V18.5435H18.584ZM18.584 16.7369V15.3138H17.161V16.7369H18.584ZM22.6671 16.7369V18.16H24.5699L24.0321 16.3347L22.6671 16.7369ZM17.903 0.567383L19.268 0.165189L17.903 -4.46787L16.5379 0.165189L17.903 0.567383ZM15.2153 9.68926L13.8503 9.28707L13.7312 9.69118L13.8513 10.095L15.2153 9.68926ZM16.2099 16.7373V18.1604H18.1127L17.5749 16.3351L16.2099 16.7373ZM11.4458 0.567834L12.8108 0.16564L11.4458 -4.46742L10.0807 0.16564L11.4458 0.567834ZM12.1268 16.7373V15.3143H10.7038V16.7373H12.1268ZM12.1268 20.7119V22.135H13.5499V20.7119H12.1268ZM10.8564 20.7119H9.43335V22.135H10.8564V20.7119ZM10.8564 16.7373H12.2795V15.3143H10.8564V16.7373ZM6.68169 16.7373L5.31663 16.3351L4.77885 18.1604H6.68169V16.7373ZM4.17628 16.7369V18.5435H7.02244V16.7369H4.17628ZM5.59803 18.16H5.59936V15.3138H5.59803V18.16ZM6.38759 9.15716L4.23504 16.3277L6.96102 17.146L9.11357 9.97547L6.38759 9.15716ZM3.73441 0.969534L6.38551 9.96847L9.11565 9.16417L6.46456 0.165231L3.73441 0.969534ZM1.70101 17.139L6.46456 0.969534L3.73441 0.165231L-1.02913 16.3347L1.70101 17.139ZM4.32894 15.3138H0.335938V18.16H4.32894V15.3138ZM5.75201 18.5435V16.7369H2.90586V18.5435H5.75201ZM5.59936 17.1204H4.32894V19.9665H5.59936V17.1204ZM17.3136 15.3138H17.3116V18.16H17.3136V15.3138ZM18.7367 18.5435V16.7369H15.8905V18.5435H18.7367ZM18.584 17.1204H17.3136V19.9665H18.584V17.1204ZM17.161 16.7369V18.5435H20.0071V16.7369H17.161ZM22.6671 15.3138H18.584V18.16H22.6671V15.3138ZM16.5379 0.969577L21.302 17.1391L24.0321 16.3347L19.268 0.165189L16.5379 0.969577ZM16.5804 10.0915L19.268 0.969577L16.5379 0.165189L13.8503 9.28707L16.5804 10.0915ZM18.6756 16.3312L16.5794 9.28355L13.8513 10.095L15.9476 17.1426L18.6756 16.3312ZM17.5749 16.3351L12.8108 0.16564L10.0807 0.970028L14.8448 17.1395L17.5749 16.3351ZM12.1268 18.1604H16.2099V15.3143H12.1268V18.1604ZM13.5499 20.7119V16.7373H10.7038V20.7119H13.5499ZM10.8564 22.135H12.1268V19.2888H10.8564V22.135ZM9.43335 16.7373V20.7119H12.2795V16.7373H9.43335ZM6.68169 18.1604H10.8564V15.3143H6.68169V18.1604ZM10.0807 0.16564L5.31663 16.3351L8.04675 17.1395L12.8108 0.970028L10.0807 0.16564Z" fill="#D5D4D0" mask="url(#path-1-inside-1_23_16709)"/>
										</svg>,
									activeIcon: <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
											<mask id="path-1-inside-1_3_13508" fill="white">
											<path fillRule="evenodd" clipRule="evenodd" d="M7.96109 0.922363L11.3088 12.2847H12.0836L10.6108 7.33325L12.4997 0.922475L15.8474 12.2848H9.15194L9.15197 12.2847H4.61335L7.96109 0.922363ZM8.4388 12.2848H7.54607V15.0777H8.4388V12.2848ZM12.0847 12.2849H12.9774V13.5544H12.0847V12.2849ZM0.152344 12.2848H3.85107L5.36315 7.2478L3.4997 0.922475L0.152344 12.2848ZM2.95738 12.2849H3.85011V13.5544H2.95738V12.2849Z"/>
											</mask>
											<path fillRule="evenodd" clipRule="evenodd" d="M7.96109 0.922363L11.3088 12.2847H12.0836L10.6108 7.33325L12.4997 0.922475L15.8474 12.2848H9.15194L9.15197 12.2847H4.61335L7.96109 0.922363ZM8.4388 12.2848H7.54607V15.0777H8.4388V12.2848ZM12.0847 12.2849H12.9774V13.5544H12.0847V12.2849ZM0.152344 12.2848H3.85107L5.36315 7.2478L3.4997 0.922475L0.152344 12.2848ZM2.95738 12.2849H3.85011V13.5544H2.95738V12.2849Z" fill="#D0CED4"/>
											<path d="M11.3088 12.2847L10.3496 12.5673L10.561 13.2847H11.3088V12.2847ZM7.96109 0.922363L8.92033 0.63974L7.96109 -2.61592L7.00186 0.639741L7.96109 0.922363ZM12.0836 12.2847V13.2847H13.4244L13.0421 11.9996L12.0836 12.2847ZM10.6108 7.33325L9.65162 7.05062L9.56795 7.33459L9.65235 7.61834L10.6108 7.33325ZM12.4997 0.922475L13.4589 0.639852L12.4997 -2.61581L11.5405 0.639852L12.4997 0.922475ZM15.8474 12.2848V13.2848H17.1846L16.8067 12.0022L15.8474 12.2848ZM9.15194 12.2848L8.19166 12.0058L7.81997 13.2848H9.15194V12.2848ZM9.15197 12.2847L10.1122 12.5638L10.4839 11.2847H9.15197V12.2847ZM4.61335 12.2847L3.65412 12.0021L3.27622 13.2847H4.61335V12.2847ZM7.54607 12.2848V11.2848H6.54607V12.2848H7.54607ZM8.4388 12.2848H9.4388V11.2848H8.4388V12.2848ZM7.54607 15.0777H6.54607V16.0777H7.54607V15.0777ZM8.4388 15.0777V16.0777H9.4388V15.0777H8.4388ZM12.9774 12.2849H13.9774V11.2849H12.9774V12.2849ZM12.0847 12.2849V11.2849H11.0847V12.2849H12.0847ZM12.9774 13.5544V14.5544H13.9774V13.5544H12.9774ZM12.0847 13.5544H11.0847V14.5544H12.0847V13.5544ZM3.85107 12.2848V13.2848H4.59496L4.80885 12.5723L3.85107 12.2848ZM0.152344 12.2848L-0.806896 12.0022L-1.18475 13.2848H0.152344V12.2848ZM5.36315 7.2478L6.32092 7.53531L6.40643 7.25048L6.32239 6.96521L5.36315 7.2478ZM3.4997 0.922475L4.45894 0.639882L3.4997 -2.61618L2.54046 0.639882L3.4997 0.922475ZM3.85011 12.2849H4.85011V11.2849H3.85011V12.2849ZM2.95738 12.2849V11.2849H1.95738V12.2849H2.95738ZM3.85011 13.5544V14.5544H4.85011V13.5544H3.85011ZM2.95738 13.5544H1.95738V14.5544H2.95738V13.5544ZM12.2681 12.0021L8.92033 0.63974L7.00186 1.20499L10.3496 12.5673L12.2681 12.0021ZM12.0836 11.2847H11.3088V13.2847H12.0836V11.2847ZM9.65235 7.61834L11.1251 12.5698L13.0421 11.9996L11.5693 7.04815L9.65235 7.61834ZM11.5405 0.639852L9.65162 7.05062L11.5701 7.61587L13.4589 1.2051L11.5405 0.639852ZM16.8067 12.0022L13.4589 0.639852L11.5405 1.2051L14.8882 12.5674L16.8067 12.0022ZM9.15194 13.2848H15.8474V11.2848H9.15194V13.2848ZM8.1917 12.0057L8.19166 12.0058L10.1122 12.5639L10.1122 12.5638L8.1917 12.0057ZM4.61335 13.2847H9.15197V11.2847H4.61335V13.2847ZM7.00186 0.639741L3.65412 12.0021L5.57258 12.5673L8.92033 1.20499L7.00186 0.639741ZM7.54607 13.2848H8.4388V11.2848H7.54607V13.2848ZM8.54607 15.0777V12.2848H6.54607V15.0777H8.54607ZM8.4388 14.0777H7.54607V16.0777H8.4388V14.0777ZM7.4388 12.2848V15.0777H9.4388V12.2848H7.4388ZM12.9774 11.2849H12.0847V13.2849H12.9774V11.2849ZM13.9774 13.5544V12.2849H11.9774V13.5544H13.9774ZM12.0847 14.5544H12.9774V12.5544H12.0847V14.5544ZM11.0847 12.2849V13.5544H13.0847V12.2849H11.0847ZM3.85107 11.2848H0.152344V13.2848H3.85107V11.2848ZM4.40537 6.96028L2.8933 11.9973L4.80885 12.5723L6.32092 7.53531L4.40537 6.96028ZM2.54046 1.20507L4.40391 7.53039L6.32239 6.96521L4.45894 0.639882L2.54046 1.20507ZM1.11158 12.5674L4.45894 1.20507L2.54046 0.639882L-0.806896 12.0022L1.11158 12.5674ZM3.85011 11.2849H2.95738V13.2849H3.85011V11.2849ZM4.85011 13.5544V12.2849H2.85011V13.5544H4.85011ZM2.95738 14.5544H3.85011V12.5544H2.95738V14.5544ZM1.95738 12.2849V13.5544H3.95738V12.2849H1.95738Z" fill="#63635E" mask="url(#path-1-inside-1_3_13508)"/>
										</svg>
									
								},
								{
									title: "browse",
									icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" clipRule="evenodd" d="M1.20674 14.0776C0.884211 13.7551 0.884211 13.2321 1.20674 12.9096L12.1853 1.93108L5.09431 1.93108C4.63818 1.93108 4.26842 1.56132 4.26842 1.10519C4.26842 0.649063 4.63818 0.279298 5.09431 0.279298L14.1791 0.279297C14.3982 0.279296 14.6082 0.36631 14.7631 0.521194C14.918 0.676079 15.005 0.886148 15.005 1.10519L15.005 10.19C15.005 10.6462 14.6353 11.0159 14.1791 11.0159C13.723 11.0159 13.3532 10.6462 13.3532 10.19L13.3532 3.09907L2.37473 14.0776C2.0522 14.4001 1.52927 14.4001 1.20674 14.0776Z" fill="#D0CED4"/>
										  </svg>,
									activeIcon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
													<mask id="path-1-outside-1_14_15006" maskUnits="userSpaceOnUse" x="0.375" y="0.796875" width="12" height="12" fill="black">
													<rect fill="white" x="0.375" y="0.796875" width="12" height="12"/>
													<path fillRule="evenodd" clipRule="evenodd" d="M1.54433 11.4557C1.31856 11.2299 1.31856 10.8639 1.54433 10.6381L9.22929 2.95311H4.26563C3.94634 2.95311 3.6875 2.69428 3.6875 2.37499C3.6875 2.0557 3.94634 1.79686 4.26563 1.79686L10.625 1.79686C10.7783 1.79686 10.9254 1.85777 11.0338 1.96619C11.1422 2.07461 11.2031 2.22166 11.2031 2.37499L11.2031 8.73437C11.2031 9.05366 10.9443 9.3125 10.625 9.3125C10.3057 9.3125 10.0469 9.05366 10.0469 8.73437L10.0469 3.77071L2.36192 11.4557C2.13615 11.6814 1.7701 11.6814 1.54433 11.4557Z"/>
													</mask>
													<path fillRule="evenodd" clipRule="evenodd" d="M1.54433 11.4557C1.31856 11.2299 1.31856 10.8639 1.54433 10.6381L9.22929 2.95311H4.26563C3.94634 2.95311 3.6875 2.69428 3.6875 2.37499C3.6875 2.0557 3.94634 1.79686 4.26563 1.79686L10.625 1.79686C10.7783 1.79686 10.9254 1.85777 11.0338 1.96619C11.1422 2.07461 11.2031 2.22166 11.2031 2.37499L11.2031 8.73437C11.2031 9.05366 10.9443 9.3125 10.625 9.3125C10.3057 9.3125 10.0469 9.05366 10.0469 8.73437L10.0469 3.77071L2.36192 11.4557C2.13615 11.6814 1.7701 11.6814 1.54433 11.4557Z" fill="#D0CED4"/>
													<path d="M1.54433 10.6381L2.25144 11.3452L2.25144 11.3452L1.54433 10.6381ZM1.54433 11.4557L0.837225 12.1628L0.837225 12.1628L1.54433 11.4557ZM9.22929 2.95311L9.93639 3.66022L11.6435 1.95311H9.22929V2.95311ZM3.6875 2.37499L4.6875 2.37499L4.6875 2.37499L3.6875 2.37499ZM4.26563 1.79686L4.26563 2.79686L4.26563 2.79686L4.26563 1.79686ZM10.625 1.79686L10.625 0.796863L10.625 0.796863L10.625 1.79686ZM11.2031 2.37499L12.2031 2.37499V2.37499H11.2031ZM11.2031 8.73437L12.2031 8.73437L12.2031 8.73437L11.2031 8.73437ZM10.625 9.3125L10.625 10.3125L10.625 10.3125L10.625 9.3125ZM10.0469 8.73437L9.04688 8.73437L9.04688 8.73437L10.0469 8.73437ZM10.0469 3.77071L11.0469 3.77071L11.0469 1.35649L9.33977 3.0636L10.0469 3.77071ZM2.36192 11.4557L3.06903 12.1628L3.06903 12.1628L2.36192 11.4557ZM0.837223 9.93097C0.220926 10.5473 0.22093 11.5465 0.837225 12.1628L2.25144 10.7486C2.41619 10.9133 2.41619 11.1804 2.25144 11.3452L0.837223 9.93097ZM8.52218 2.24601L0.837223 9.93097L2.25144 11.3452L9.93639 3.66022L8.52218 2.24601ZM4.26563 3.95311H9.22929V1.95311H4.26563V3.95311ZM2.6875 2.37499C2.6875 3.24656 3.39405 3.95311 4.26563 3.95311V1.95311C4.49862 1.95311 4.6875 2.14199 4.6875 2.37499H2.6875ZM4.26563 0.796864C3.39405 0.796863 2.6875 1.50341 2.6875 2.37499L4.6875 2.37499C4.6875 2.60798 4.49862 2.79686 4.26563 2.79686L4.26563 0.796864ZM10.625 0.796863L4.26563 0.796864L4.26563 2.79686L10.625 2.79686L10.625 0.796863ZM11.7409 1.25908C11.445 0.96313 11.0435 0.796863 10.625 0.796863V2.79686C10.5131 2.79686 10.4058 2.75241 10.3267 2.6733L11.7409 1.25908ZM12.2031 2.37499C12.2031 1.95644 12.0369 1.55504 11.7409 1.25908L10.3267 2.6733C10.2476 2.59418 10.2031 2.48688 10.2031 2.37499H12.2031ZM12.2031 8.73437L12.2031 2.37499L10.2031 2.37499L10.2031 8.73437L12.2031 8.73437ZM10.625 10.3125C11.4966 10.3125 12.2031 9.60595 12.2031 8.73437L10.2031 8.73437C10.2031 8.50138 10.392 8.3125 10.625 8.3125L10.625 10.3125ZM9.04688 8.73437C9.04688 9.60595 9.75343 10.3125 10.625 10.3125L10.625 8.3125C10.858 8.3125 11.0469 8.50138 11.0469 8.73437L9.04688 8.73437ZM9.04688 3.77071L9.04688 8.73437L11.0469 8.73437L11.0469 3.77071L9.04688 3.77071ZM3.06903 12.1628L10.754 4.47781L9.33977 3.0636L1.65482 10.7486L3.06903 12.1628ZM0.837225 12.1628C1.45352 12.7791 2.45273 12.7791 3.06903 12.1628L1.65482 10.7486C1.81957 10.5838 2.08668 10.5838 2.25144 10.7486L0.837225 12.1628Z" fill="#63635E" mask="url(#path-1-outside-1_14_15006)"/>
												</svg>

								},
								{
									title: 'fish',
									icon: <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M17.4711 14.8025C19.529 14.3996 18.4527 12.7234 18.4527 12.7234C12.734 5.46431 8.38234 8.35865 2.42578 3.12029C0.955998 1.49664 -0.715836 -1.89943 0.598219 2.09609C0.832627 2.80883 1.85679 3.80189 2.31175 4.55916C9.25381 8.53614 7.48049 12.2054 17.4711 14.8025Z" fill="url(#paint0_linear_39_17251)" stroke="url(#paint1_linear_39_17251)" strokeWidth="0.171649" strokeLinecap="round"/>
											<defs>
											<linearGradient id="paint0_linear_39_17251" x1="17.259" y1="18.3281" x2="-0.381526" y2="-11.4742" gradientUnits="userSpaceOnUse">
											<stop stopColor="#D6D6D6"/>
											<stop offset="0.31812" stopColor="#D0CED4"/>
											</linearGradient>
											<linearGradient id="paint1_linear_39_17251" x1="16.8595" y1="14.8094" x2="-4.73744" y2="-2.93848" gradientUnits="userSpaceOnUse">
											<stop stopColor="#EBEBEB"/>
											<stop offset="1" stopColor="#858585"/>
											</linearGradient>
											</defs>
										  </svg>,
									activeIcon: <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M18.4711 15.8025C20.529 15.3996 19.4527 13.7234 19.4527 13.7234C13.734 6.46431 9.38234 9.35865 3.42578 4.12029C1.956 2.49664 0.284164 -0.899428 1.59822 3.09609C1.83263 3.80883 2.85679 4.80189 3.31175 5.55916C10.2538 9.53614 8.48049 13.2054 18.4711 15.8025Z" fill="url(#paint0_linear_39_17251)"/>
													<path d="M18.4711 15.8025C20.529 15.3996 19.4527 13.7234 19.4527 13.7234C13.734 6.46431 9.38234 9.35865 3.42578 4.12029C1.956 2.49664 0.284164 -0.899428 1.59822 3.09609C1.83263 3.80883 2.85679 4.80189 3.31175 5.55916C10.2538 9.53614 8.48049 13.2054 18.4711 15.8025Z" stroke="url(#paint1_linear_39_17251)" strokeLinecap="round"/>
													<path d="M18.4711 15.8025C20.529 15.3996 19.4527 13.7234 19.4527 13.7234C13.734 6.46431 9.38234 9.35865 3.42578 4.12029C1.956 2.49664 0.284164 -0.899428 1.59822 3.09609C1.83263 3.80883 2.85679 4.80189 3.31175 5.55916C10.2538 9.53614 8.48049 13.2054 18.4711 15.8025Z" stroke="#63635E" strokeLinecap="round"/>
													<defs>
													<linearGradient id="paint0_linear_39_17251" x1="18.259" y1="19.3281" x2="0.618474" y2="-10.4742" gradientUnits="userSpaceOnUse">
													<stop stopColor="#D6D6D6"/>
													<stop offset="0j.31812" stopColor="#D0CED4"/>
													</linearGradient>
													<linearGradient id="paint1_linear_39_17251" x1="17.8595" y1="15.8094" x2="-3.73744" y2="-1.93848" gradientUnits="userSpaceOnUse">
													<stop stopColor="#EBEBEB"/>
													<stop offset="1" stopColor="#858585"/>
													</linearGradient>
													</defs>
												</svg>		
								}
								
							].map((el, idx) => (
								<WorldModelControlButton 
									key={idx}
									idx={idx}
									title={el.title}
									icon={el.icon}
									activeIcon={el.activeIcon}
									isActive={selectedOutput===el.title}

									setSelectedOutput={setSelectedOutput}
								/>
							))
							}
						</div>
						<div className='tl-worldModel-outputPanel' 
						onPointerDown={stopEventPropagation}
						style={{
							flex: 1,
							height: "100%",

						}}>
						{{
							"manipulate": 
							<SVGContainer>
							{/* // <svg style={{ height: '100%', width: }}> */}
								<defs>
									<filter id="boxShadow" x="-50%" y="-50%" width="200%" height="200%">
									<feDropShadow dx="0" dy="36" stdDeviation="21" floodColor="#4D4D4D" floodOpacity="0.15"/>
									</filter>
								</defs>
								<rect
									// className={classNames('tl-frame__body', { 'tl-frame__creating': isCreating })}
									width="100%"
									height="100%"
									rx="12"
									ry="12"
									fill="#F9F9F8"
									strokeWidth="1"
									stroke="#DDDDDA"
									filter="url(#boxShadow)"
			
								/>
							{/* </svg> */}
							// </SVGContainer>
						}[selectedOutput]
						}
						</div>
					</div>
				}
			</HTMLContainer>
		)
	}

	indicator(shape: TLWorldModelShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds

		return (
			<rect
				rx="12"
				ry="12"
				width={toDomPrecision(bounds.width)}
				height={toDomPrecision(bounds.height)}
				className={`tl-frame-indicator`}
			/>
		)
	}

	override canReceiveNewChildrenOfType = (shape: TLShape, _type: TLShape['type']) => {
		return !shape.isLocked
	}

	override providesBackgroundForChildren(): boolean {
		return true
	}

	override canDropShapes = (shape: TLWorldModelShape, _shapes: TLShape[]): boolean => {
		return !shape.isLocked
	}

	override onDragShapesOver = (frame: TLWorldModelShape, shapes: TLShape[]) => {
		if (!shapes.every((child) => child.parentId === frame.id)) {
			this.editor.reparentShapes(shapes, frame.id)
		}
	}

	override onDragShapesOut = (_shape: TLWorldModelShape, shapes: TLShape[]): void => {
		const parent = this.editor.getShape(_shape.parentId)
		const isInGroup = parent && this.editor.isShapeOfType<TLGroupShape>(parent, 'group')

		// If frame is in a group, keep the shape
		// moved out in that group

		if(!_shape.props.minimized){
			if (isInGroup) {
				this.editor.reparentShapes(shapes.filter(shape => shape.type !== 'kinematicCanvas'), parent.id)
			} else {
				this.editor.reparentShapes(shapes.filter(shape => shape.type !== 'kinematicCanvas'), this.editor.getCurrentPageId())
			}
		}
	}

	override onResize: TLOnResizeHandler<any> = (shape, info) => {		
		return resizeBox(shape, info)
	}
}