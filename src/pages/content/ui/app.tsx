// import BasePanel from "./BasePanel/BasePanel.jsx"
// import GlobalAIText from "./GlobalComponents/GlobalAIText/GlobalAIText.jsx"
// import LocalAIText from "./LocalComponents/LocalAIText/LocalAIText.jsx"
// import PlanList from "./GlobalComponents/Plan/PlanList/PlanList.jsx";
// import TaskLog from "./GlobalComponents/TaskLog/TaskLog.jsx";
// import Sidepanel from "@pages/content/ui/GlobalComponents/Sidepanel/Sidepanel.jsx";
// import ControlPanel from "@pages/content/ui/LocalComponents/ControlPanel/ControlPanel.jsx";
// import FishAgent from "@root/src/pages/content/ui/LocalComponents/FishAgentPersistent/FishAgentPersistent.jsx";// import CaptureHighlight from "@pages/content/ui/LocalComponents/CaptureHighlight/CaptureHighlight.jsx"
// import CaptureHighlight from "@pages/content/ui/LocalComponents/CaptureHighlight/CaptureHighlight.jsx"



import { useState, useEffect } from 'react';
import ShadowDOMOutlet from "@pages/content/ui/ShadowDOMOutlet/ShadowDOMOutlet.jsx"
import FishSwarm from "@pages/content/ui/LocalComponents/FishSwarm/FishSwarm.jsx";

function changePageLayout(){
  let pageContainer = document.getElementById("kiln-page-container")
  // create container
  if(pageContainer){
    while (pageContainer.firstChild) {
      document.body.insertBefore(pageContainer.firstChild, pageContainer);
    }
  
    // Remove the pageContainer element
    pageContainer.remove();
  }
  else{
    const newPageContainer = document.createElement("span");
    newPageContainer.id = 'kiln-page-container'

    // Move the body's children into this wrapper
    while (document.body.firstChild){
      newPageContainer.appendChild(document.body.firstChild);
    }
    // Append the wrapper to the body
    document.body.appendChild(newPageContainer);

    newPageContainer.style.position = 'absolute'
    // newPageContainer.style.top: 
    newPageContainer.style.border = '2px solid orange'
    newPageContainer.style.height = '80vh'
    newPageContainer.style.width = '40vw'
    newPageContainer.style.overflow = 'scroll'
  }

}

export default function App() {
  const [shadowOpen, setShadowOpen] = useState(false);

  return (
      <div style={styles.app}>
        {shadowOpen && <ShadowDOMOutlet />}
        <div style={styles.canvasActivation} onClick={()=>{setShadowOpen(true)}}>
          <svg width="40" height="40" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14.0018" cy="13.9998" r="4.38462" fill="#D0CED4"/>
            <circle cx="14.0015" cy="13.9995" r="12.4231" stroke="#D0CED4" strokeWidth="1.46154"/>
          </svg>
        </div>
        <div style={{...styles.canvasActivation, left: '80px'}} onClick={changePageLayout}>
          <p>Toggle Page</p>
        </div>
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
