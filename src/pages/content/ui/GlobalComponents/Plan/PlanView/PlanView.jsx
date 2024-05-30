import { useState } from 'react';

import GoalBanner from '@pages/content/ui/GlobalComponents/GoalBanner/GoalBanner.jsx'
import PlanList from "@pages/content/ui/GlobalComponents/Plan/PlanList/PlanList.jsx"
import Separator from "@pages/content/ui/ScriptHelpers/Separator/Separator.jsx"
import TaskBox from "@pages/content/ui/GlobalComponents/TaskBox/TaskBox.jsx"

export default function PlanView({ activeGoal, setActiveGoal, ...props}){
    const [focusedTask, setFocusedTask] = useState(null);



    const styles = {
        planViewWrapper: {
            display: 'flex',
            flexDirection: "column",
            gap: '10px'
        }
    }

    return(
        <div className='planViewWrapper' style={styles.planViewWrapper}>
            <GoalBanner activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
            <PlanList focusedTask={focusedTask} setFocusedTask={setFocusedTask}/>
            <Separator />
            {focusedTask &&
                <TaskBox />
            }
        </div>
    )
}