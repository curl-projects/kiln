import styles from './GoalsView.module.css';
import AIText from '../../HelperComponents/AIText/AIText.jsx';
import Separator from '../../HelperComponents/Separator/Separator.jsx';
import GoalCard, { NewGoalCard } from '../GoalCard/GoalCard.jsx';
import { useDatabase } from '../../../Helpers/Providers/DatabaseProvider';

export default function GoalsView({ activeGoal, setActiveGoal }){
    const { goals } = useDatabase();
    
    return(
        <div className={styles.goalsViewWrapper}>
            <AIText aiData={{}} promptType="sayHello"/>
            <Separator />
            <div className={styles.goalCardWrapper}>
                {goals && goals.map((goal) => 
                    <GoalCard 
                        key={goal.id} 
                        goal={goal} 
                        isActive={activeGoal && activeGoal.id === goal.id}
                        setActiveGoal={setActiveGoal}/>
                )}
                <NewGoalCard />
            </div>
        </div>
    )
}