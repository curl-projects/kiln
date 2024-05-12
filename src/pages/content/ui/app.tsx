import BasePanel from "./BasePanel/BasePanel.jsx"
import GlobalAIText from "./GlobalComponents/GlobalAIText/GlobalAIText.jsx"
import LocalAIText from "./LocalComponents/LocalAIText/LocalAIText.jsx"
import PlanList from "./GlobalComponents/Plan/PlanList/PlanList.jsx";

export default function App() {
  return (
      <div>
        <BasePanel type="globalAI" config={{keys: ['finnKey', 'goals', "globalAIStream"]}}>
         <GlobalAIText streamName="globalAIStream"/>
        </BasePanel>
        <BasePanel type="localAI" config={{keys: ['finnKey', 'goals', "globalAIStream"]}}>
         <LocalAIText />
        </BasePanel>
        <BasePanel type="planList" config={{keys: []}} forceOpen={true}>
         <PlanList />
        </BasePanel>
      </div>
  );
}
