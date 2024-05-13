import { useState, useEffect } from 'react';
import GoalsView from './Components/GoalComponents/GoalsView/GoalsView.jsx';
import PlanView from './Components/PlanComponents/PlanView/PlanView.jsx';

export default function SidePanel(){
  const [activeGoal, setActiveGoal] = useState(null);
  const [pageView, setPageView] = useState("goalsView");

  useEffect(()=>{
    activeGoal ? setPageView("planView") : setPageView("goalsView")
  }, [activeGoal])

  return(
    <div className={styles.sidepanelWrapper}>
      {
        {
          goalsView: <GoalsView activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>,
          planView: <PlanView activeGoal={activeGoal} setActiveGoal={setActiveGoal} />
        }[pageView]
      }
    </div>
  )
}

const styles = {
  sidepanelWrapper: {
    height: "500px",
    width: "300px",
    overflowX: "hidden",
    overflowY: "scroll",
    padding: '20px',
    boxSizing: "border-box"
  }
}