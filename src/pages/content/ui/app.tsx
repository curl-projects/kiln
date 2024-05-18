import BasePanel from "./BasePanel/BasePanel.jsx"
import GlobalAIText from "./GlobalComponents/GlobalAIText/GlobalAIText.jsx"
import LocalAIText from "./LocalComponents/LocalAIText/LocalAIText.jsx"
import PlanList from "./GlobalComponents/Plan/PlanList/PlanList.jsx";
import TaskLog from "./GlobalComponents/TaskLog/TaskLog.jsx";
import { useState, useEffect } from 'react';
import Sidepanel from "@pages/content/ui/GlobalComponents/Sidepanel/Sidepanel.jsx";
import ControlPanel from "@pages/content/ui/LocalComponents/ControlPanel/ControlPanel.jsx";

import ShadowDOMOutlet from "@pages/content/ui/ShadowDOMOutlet/ShadowDOMOutlet.jsx"

export default function App() {
  const [shadowOpen, setShadowOpen] = useState(false);

  return (
      <div>
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
          />
        </BasePanel>
      </div>
  );
}
