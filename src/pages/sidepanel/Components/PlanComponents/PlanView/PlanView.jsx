import styles from './PlanView.module.css';
import { useState } from 'react';

import GoalBanner from '../../GoalComponents/GoalBanner/GoalBanner';
import PlanList from '../PlanList/PlanList.jsx';
import Separator from '../../HelperComponents/Separator/Separator';
import TaskBox from "../../TaskComponents/TaskBox/TaskBox";


export default function PlanView({ activeGoal, setActiveGoal }){
    const [focusedTask, setFocusedTask] = useState(null);

    return(
        <div className='panelViewWrapper' style={styles.planViewWrapper}>
            <GoalBanner activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
            <PlanList focusedTask={focusedTask} setFocusedTask={setFocusedTask}/>
            <Separator />
            {focusedTask &&
                <TaskBox />
            }
        </div>
    )
}