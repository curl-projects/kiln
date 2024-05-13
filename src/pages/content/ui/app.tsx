import BasePanel from "./BasePanel/BasePanel.jsx"
import GlobalAIText from "./GlobalComponents/GlobalAIText/GlobalAIText.jsx"
import LocalAIText from "./LocalComponents/LocalAIText/LocalAIText.jsx"
import PlanList from "./GlobalComponents/Plan/PlanList/PlanList.jsx";
import TaskLog from "./GlobalComponents/TaskLog/TaskLog.jsx";
import Sidepanel from "@pages/content/ui/GlobalComponents/Sidepanel/Sidepanel.jsx";

export default function App() {
  return (
      <div>
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
        {/* <BasePanel type="taskLog" config={{keys: []}} initialForceOpen={false} edge='left' position={25}>
         <TaskLog />
        </BasePanel> */}
      </div>
  );
}
