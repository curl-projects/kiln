import { useEffect } from 'react';

import Separator from '@pages/content/ui/ScriptHelpers/Separator/Separator.jsx';

import GlobalAIText from '@pages/content/ui/GlobalComponents/GlobalAIText/GlobalAIText.jsx';
import GoalCard, { NewGoalCard } from '@pages/content/ui/GlobalComponents/GoalCard/GoalCard.jsx';

import { useContext } from "react";
import { BasePanelContext } from '@pages/content/ui/PanelLogic/PanelLogic.jsx'


export default function GoalsView({ activeGoal, setActiveGoal }){
    const { goals } = useContext(BasePanelContext);

    useEffect(()=>{
        setActiveGoal(null)
    }, [])


    useEffect(()=>{
        console.log("HI! Goals View")
    }, [])

    return(
        <div style={styles.goalsViewWrapper}>
            {/* <GlobalAIText promptType='sayHello' streamName="globalAIStream" /> */}
            {/* <Separator /> */}
            <div style={styles.goalCardWrapper}>
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

const styles = {
    goalsViewWrapper: {
      paddingTop: '10px',
      paddingBottom: '20px',
    },
    goalCardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingLeft: '20px',
    },
  };
  