import { useState, useEffect } from 'react';
import GoalsView from '@pages/content/ui/GlobalComponents/GoalsView/GoalsView.jsx'
import PlanView from '@pages/content/ui/GlobalComponents/Plan/PlanView/PlanView.jsx'

const styles = {
    sidepanelWrapper: {
    //   height: "500px",
      width: "300px",
      overflowX: "hidden",
      overflowY: "scroll",
      boxSizing: "border-box"
    }
}

export default function SidePanel(){

    useEffect(()=>{
        console.log("HELLO Sidepanel")
    }, [])

    const [activeGoal, setActiveGoal] = useState(null);

    return(
    <div style={styles.sidepanelWrapper} className='sidepanelWrapper'>
        {!activeGoal
            ? <GoalsView activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
            : <PlanView activeGoal={activeGoal} setActiveGoal={setActiveGoal} /> 
        }
    </div>
    )
}