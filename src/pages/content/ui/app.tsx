import BasePanel from "./BasePanel/BasePanel.jsx"
import GlobalAIText from "./GlobalComponents/GlobalAIText/GlobalAIText.jsx"
import LocalAIText from "./LocalComponents/LocalAIText/LocalAIText.jsx"
import PlanList from "./GlobalComponents/Plan/PlanList/PlanList.jsx";
import TaskLog from "./GlobalComponents/TaskLog/TaskLog.jsx";
import { useState, useEffect } from 'react';
import Sidepanel from "@pages/content/ui/GlobalComponents/Sidepanel/Sidepanel.jsx";
import ControlPanel from "@pages/content/ui/LocalComponents/ControlPanel/ControlPanel.jsx";
import FishAgent from "@root/src/pages/content/ui/LocalComponents/FishAgentPersistent/FishAgentPersistent.jsx";
import FishSwarm from "@pages/content/ui/LocalComponents/FishSwarm/FishSwarm.jsx";
import ShadowDOMOutlet from "@pages/content/ui/ShadowDOMOutlet/ShadowDOMOutlet.jsx"
import CaptureHighlight from "@pages/content/ui/LocalComponents/CaptureHighlight/CaptureHighlight.jsx"

export default function App() {
  const [shadowOpen, setShadowOpen] = useState(true);
  const [fishMoved, setFishMoved] = useState(false);

  return (
      <div style={styles.app}>
        {shadowOpen && <ShadowDOMOutlet />}
        {/* <BasePanel type="globalAI" config={{keys: ['goals', "globalAIStream"]}}>
         <GlobalAIText streamName="globalAIStream"/>
      </BasePanel> */}
        {/* <BasePanel type="localAI" config={{keys: ['goals', "globalAIStream"]}}>
         <LocalAIText />
        </BasePanel> */}
        {/* <BasePanel type="planList" config={{keys: []}} initialForceOpen={false} edge='right' position={25}>
         <PlanList />
        </BasePanel> */}
        <BasePanel type="sidePanel" config={{keys: ['goals', 'globalAIStream']}} initialForceOpen={false} edge='right' position={0}>
         <Sidepanel />
        </BasePanel>

        <BasePanel type='controls' config={{keys: []}} initialForceOpen={true} edge='left' position={60}>
          <ControlPanel 
            shadowOpen={shadowOpen} 
            setShadowOpen={setShadowOpen}
            setFishMoved={setFishMoved}
          />
        
        </BasePanel>
          {/* <div className="centered-text-wrapper" style={styles.centeredTextWrapper}>
            <div className="centered-text" style={styles.centeredText}>Hello Text</div>
          </div> */}
        <FishSwarm fishConfig={['researcher', 'planner', 'optimist', 'critic']}/>
        <CaptureHighlight />
      </div>
  );
}


const styles = {
  app: {
    fontFamily: "Helvetica Neue, sans-serif",
  },
  centeredTextWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  centeredText: {
    fontSize: '5rem', // Large text size
    fontWeight: 'bold', // Bold text
    color: '#7F847D',
    filter: "opacity(0.8)",
    zIndex: 10000001,
    letterSpacing: '-0.06em',

  },
};
