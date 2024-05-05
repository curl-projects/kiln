import GoalCard, { NewGoalCard } from "../GoalCard/GoalCard.jsx"
import styles from './SidepanelHomepage.module.css'
import MainTextChat from "../MainTextChat/MainTextChat";

export default function SidepanelHomepage({ goals, activeGoal, setActiveGoal, goalStatus }){
    
    if(goalStatus === 'pending'){
        <div>Loading</div>
    }
  
    if(goalStatus === 'error'){
        <div>{goalError.message}</div>
    }

    return(
    <div className={styles.sidepanelHomepageWrapper}>
       <MainTextChat 
        aiData = {{
            activeGoal: activeGoal,
            goals: goals
        }}
       />
       <div className={styles.goalCardWrapper}>
        {goals && goals.map((goal)=>
            <GoalCard
                key={goal.id}
                goal={goal}
                isActive={activeGoal && activeGoal.id === goal.id}
                setActiveGoal={setActiveGoal}
            />
        )}
        <NewGoalCard />
        </div>
    </div>
    )
}