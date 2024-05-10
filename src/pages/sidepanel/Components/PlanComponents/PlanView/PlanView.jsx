import styles from './PlanView.module.css';

import GoalBanner from '../../GoalComponents/GoalBanner/GoalBanner';
import PlanList from '../PlanList/PlanList';
import Separator from '../../HelperComponents/Separator/Separator';
import TaskBox from "../../TaskComponents/TaskBox/TaskBox";

export default function PlanView({ activeGoal, setActiveGoal }){
    return(
        <>
            <GoalBanner activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
            <PlanList />
            <Separator />
            <TaskBox />
        </>
    )
}