import { useState, useEffect } from 'react';
import ShadowDOMOutlet from "@pages/content/ui/ShadowDOMOutlet/ShadowDOMOutlet.jsx"
import { FaExpandArrowsAlt } from "react-icons/fa";
import { TbBrandPagekit } from "react-icons/tb";
import { SiPaperswithcode } from "react-icons/si";
import CaptureHighlight from "@pages/content/ui/ShadowDOMOutlet/ShadowFishCanvas/CustomUI/CaptureHighlight.jsx"

export default function App() {
  const [shadowOpen, setShadowOpen] = useState(false);
  const [canvasMode, setCanvasMode] = useState('page') // 'closed', 'page', 'full'

  function openCanvas(){

    console.log("SET SHADOW OPEN")
    setShadowOpen(true)
  }

  function closeCanvas(){
    setShadowOpen(false)
  }
  
  function tearDownContainer(){
    const shadowDOM = document.getElementById('shadowDOMWrapper')
    if(shadowDOM){shadowDOM.style.zIndex = '10000000'}

    let pageContainer = document.getElementById("kiln-page-container")
  
    if(pageContainer){
      while (pageContainer.firstChild) {
         document.body.insertBefore(pageContainer.firstChild, pageContainer);
      }
    
      // Remove the pageContainer element
      pageContainer.remove();
    }
  }
  
  function setUpContainer(){
    const newPageContainer = document.createElement("span");
      newPageContainer.id = 'kiln-page-container'
    
      for(let childNode of document.body.children){
        if (childNode.id !== 'goals-extension-content-view-root') {
          newPageContainer.appendChild(childNode)
        }
      }

      document.body.appendChild(newPageContainer);
    
      Object.assign(newPageContainer.style, {
        position: 'fixed',
        border: '2px solid #DAD9D6', // the last border style will be applied
        height: '84vh',
        width: '44vw',
        overflow: 'scroll',
        left: '24px',
        background: window.getComputedStyle(document.body).background,
        top: '50%',
        pointerEvents: 'all',
        transform: 'translateY(-50%)',
        zIndex: '100000000',
        borderRadius: '8px',
        boxShadow: '0px 36px 42px -4px rgba(77, 77, 77, 0.45)'
    });

    const shadowDOM = document.getElementById('shadowDOMWrapper')
    if(shadowDOM){
      shadowDOM.style.zIndex = '0'
    }
  }

  // useEffect(()=>{
  //   (async () => {
  //     const data: any = chrome.runtime.sendMessage({ action: 'retrieveCanvasMode'})
  //     if(data?.canvasMode){
  //       setCanvasMode(data.canvasMode) 
  //     }
  //   })()
  // }, [])

  // useEffect(()=>{
  //   console.log("SENDING MESSAGE")
  //   chrome.runtime.sendMessage({ action: "saveCanvasMode", canvasMode: canvasMode})
  // }, [canvasMode])

  useEffect(()=>{
    
    switch(canvasMode){
      case 'page':
        // delete container 
        tearDownContainer();
        closeCanvas();
        break
        // close canvas

      case 'mixed': 
        tearDownContainer();
        closeCanvas();
        openCanvas();
        setUpContainer();
        break

      case 'canvas':
        tearDownContainer();
        openCanvas();
        // delete canvas
        break

      default:
        break
    }
  }, [canvasMode])

  return (
      <div style={styles.app}>
        {shadowOpen &&
        <ShadowDOMOutlet shadowOpen={shadowOpen} canvasMode={canvasMode}/>
        }
        <div style={{
          position: 'fixed',
          bottom: "40px",
          left: "40px",
          width: "fit-content",
          height: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000000000,
          borderRadius: '8px',
          gap: '10px',
        }}>
          <CanvasButton 
            handleClick={()=>{ canvasMode !== 'page' && setCanvasMode('page') }}
            name='page'
            active={canvasMode === 'page'}
          >
            <TbBrandPagekit />
          </CanvasButton>
          {/* <div onClick={()=>{ canvasMode !== 'page' && setCanvasMode('page') }} 
            className='tl-kiln-outer-controls'
            style={{
              backgroundColor: canvasMode === 'page' ? 'rgba(211, 211, 211, 1)' : "rgba(233, 232, 230, 0.95)"
             }}
          ><TbBrandPagekit /></div> */}
          <CanvasButton 
            handleClick={()=>{ canvasMode !== 'mixed' && setCanvasMode('mixed') }}
            name='mixed'
            active={canvasMode === 'mixed'}
          >
            <SiPaperswithcode />
          </CanvasButton>
          <CanvasButton 
            handleClick={()=>{ canvasMode !== 'canvas' && setCanvasMode('canvas') }}
            name='canvas'
            active={canvasMode === 'canvas'}
          >
            <FaExpandArrowsAlt />
          </CanvasButton>

{/* 
          <div onClick={()=>{
            canvasMode !== 'mixed' && setCanvasMode('mixed')
          }}
           className='tl-kiln-outer-controls'
           style={{
            backgroundColor: canvasMode === 'mixed' ? 'rgba(211, 211, 211, 1)' : "rgba(233, 232, 230, 0.95)"
           }}
          ><SiPaperswithcode /></div>
       
          <div className='tl-kiln-outer-controls'
             style={{
              backgroundColor: canvasMode === 'canvas' ? 'rgba(211, 211, 211, 1)' : "rgba(233, 232, 230, 0.95)"
             }}
            onClick={()=>{
              canvasMode !== 'canvas' && setCanvasMode('canvas')}}>
                <FaExpandArrowsAlt />
          </div>
         */}

        </div>
        {/* <div style={styles.canvasActivation} onClick={()=>{setShadowOpen(t => !t)}}>
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14.0018" cy="13.9998" r="4.38462" fill="#D0CED4"/>
            <circle cx="14.0015" cy="13.9995" r="12.4231" stroke="#D0CED4" strokeWidth="1.46154"/>
          </svg>
        </div>
        <div style={{...styles.canvasActivation, left: '80px'}} onClick={()=>{}}>
          <p>Toggle Page</p>
        </div> */}
      {canvasMode === 'mixed' &&
        <div 
        style={{
          position: 'absolute',
          left: '24px',
          top: '8vh',
          transform: 'translateY(-130%)',
          zIndex: 1000000000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: "14px",
          margin: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.15372 1.95189C5.15469 1.95189 1.91283 5.19375 1.91283 9.19279C1.91283 13.1918 5.15469 16.4337 9.15372 16.4337C13.1528 16.4337 16.3947 13.1918 16.3947 9.19279C16.3947 5.19375 13.1528 1.95189 9.15372 1.95189ZM0.769531 9.19279C0.769531 4.56232 4.52326 0.808594 9.15372 0.808594C13.7841 0.808594 17.538 4.56232 17.538 9.19279C17.538 13.8233 13.7841 17.577 9.15372 17.577C4.52326 17.577 0.769531 13.8233 0.769531 9.19279Z" fill="#191400" fillOpacity="0.207843"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M16.7752 9.70181H1.53125V8.68555H16.7752V9.70181Z" fill="#191400" fillOpacity="0.207843"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.64534 16.8151V1.57107H9.66161V16.8151H8.64534ZM12.8058 9.19304C12.8058 6.43294 11.8132 3.70241 9.8673 1.89699L10.4721 1.24512C12.6338 3.25068 13.695 6.23666 13.695 9.19304C13.695 12.1494 12.6338 15.1354 10.4721 17.141L9.8673 16.4891C11.8132 14.6837 12.8058 11.9532 12.8058 9.19304ZM4.70703 9.19307C4.70703 6.24095 5.73368 3.25652 7.8295 1.24992L8.44445 1.89222C6.55982 3.69663 5.59626 6.42868 5.59626 9.19307C5.59628 11.9575 6.55985 14.6895 8.44448 16.4939L7.82951 17.1362C5.7337 15.1296 4.70704 12.1452 4.70703 9.19307Z" fill="#191400" fillOpacity="0.207843"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M9.15435 4.69336C11.9101 4.69336 14.7125 5.20294 16.612 6.26409C16.8265 6.38384 16.9032 6.6547 16.7834 6.86908C16.6637 7.08345 16.3928 7.16017 16.1785 7.04041C14.4636 6.08252 11.8323 5.58259 9.15435 5.58259C6.47644 5.58259 3.84507 6.08252 2.13028 7.04041C1.91589 7.16017 1.64503 7.08345 1.52528 6.86908C1.40554 6.6547 1.48224 6.38384 1.69662 6.26409C3.59627 5.20294 6.39858 4.69336 9.15435 4.69336ZM9.15435 13.4485C11.9101 13.4485 14.7125 12.9388 16.612 11.8777C16.8265 11.758 16.9032 11.4871 16.7834 11.2727C16.6637 11.0584 16.3928 10.9816 16.1785 11.1014C14.4636 12.0593 11.8323 12.5592 9.15435 12.5592C6.47644 12.5592 3.84507 12.0593 2.13028 11.1014C1.91589 10.9816 1.64503 11.0584 1.52528 11.2727C1.40554 11.4871 1.48224 11.758 1.69662 11.8777C3.59627 12.9388 6.39858 13.4485 9.15435 13.4485Z" fill="#191400" fillOpacity="0.207843"/>
          </svg>

          <p style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "18px",
            letterSpacing: '-0.02em',
            fontWeight: 500,
            color: "#82827C",
            margin: 0,
            cursor: "pointer",
          }}>{document.title}</p>
          <div 
          onClick={()=> { setCanvasMode('page') }}
          style={{
            height: '18px',
            width: '18px',
            margin: 0,
            backgroundColor: "#E8E7E9",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '100%',
            cursor: 'pointer',
          }}>
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.637995 5.96455C0.506085 5.83264 0.506085 5.61878 0.637994 5.48687L5.12801 0.996841L2.22794 0.996841C2.04139 0.996841 1.89017 0.845614 1.89017 0.659066C1.89017 0.472517 2.04139 0.32129 2.22794 0.32129L5.94348 0.321289C6.03306 0.321289 6.11897 0.356876 6.18232 0.420221C6.24566 0.483567 6.28125 0.569481 6.28125 0.659065L6.28125 4.3746C6.28125 4.56115 6.13002 4.71238 5.94347 4.71238C5.75693 4.71238 5.6057 4.56115 5.6057 4.3746L5.6057 1.47453L1.11568 5.96455C0.983772 6.09646 0.769905 6.09646 0.637995 5.96455Z" fill="#C9C8C9"/>
            </svg>  
          </div>
        </div>
      }
      <CaptureHighlight />
      </div>
  );
}


const styles = {
  app: {
    fontFamily: "Helvetica Neue, sans-serif",
  }, 
  canvasActivation: {
    position: 'fixed',
    cursor: 'pointer',
    bottom: "10px",
    left: "10px",
    width: "60px",
    height: '60px',
    border: '1px solid #e8e7e9',
    backgroundColor: "rgba(255, 255, 255, 1)",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000000000,
    borderRadius: '8px',
  }

};


function CanvasButton({ children, handleClick, active, name }){
	const [hovered, setHovered] = useState(false)
	return(
		<div 
			className='tl-kiln-outer-controls'
			style={{backgroundColor: active ? 'rgba(211, 211, 211, 1)' : "rgba(233, 232, 230, 0.95)"}} 
			onPointerDown={handleClick}
			onMouseEnter={()=>setHovered(true)}
			onMouseLeave={()=>setHovered(false)}
			>
			{children}
			{/* {hovered &&
				<div style={{
					position: "absolute",
					bottom: "100%",
					marginBottom: '10px',
					width: 'fit-content',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: "#F9F9F8",
					border: "2px solid #D2D1CD",
					borderRadius: "12px",
					paddingLeft: "8px",
					paddingRight: "8px",
					boxShadow: "0px 36px 42px -4px rgba(77, 77, 77, 0.15)",
				}}>
					<p style={{
						fontWeight: 600,
						fontSize: '8px',
						color: "#63635E",
						display: "flex",
						alignItems: 'center',
						margin: 0,
						fontFamily: 'monospace',
					}}>{name}</p>
				</div>
			} */}
		</div>
	)
}