import BasePanel from "./BasePanel/BasePanel.jsx"

export default function App() {

  return (
      <div>
        <BasePanel type="Test" config={{keys: ['finnKey', 'goals']}}/>
      </div>
  );
}
