import '@pages/sidepanel/SidePanel.css';
import { useState, useEffect } from 'react';
import styles from "@pages/sidepanel/SidePanel.module.css"
import GoalCard from "./GoalCard/GoalCard.jsx"
import GoalView from './GoalView/GoalView.jsx';
import { useQuery } from '@tanstack/react-query'
import useActiveTabDataUpdater from './useActiveTabData';

// import cheerio from "cheerio";

import { fetchGoals } from "../api-funcs/goals.js"

export default function SidePanel(props){
    const [userInfo, setUserInfo] = useState({id: null, email: null});
    const [activeGoal, setActiveGoal] = useState(null)

    const { activeTabData, pageData } = useActiveTabDataUpdater();
    

    useEffect(() => {
      chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(profileInfo){
        setUserInfo({...userInfo, id: profileInfo.id, email: profileInfo.email})
      })
    }, []);


    const { status: goalStatus, data: goalData, error: goalError, refetch: refetchGoals } = useQuery({ 
      queryKey: ['goals', userInfo], 
      queryFn: () => fetchGoals(userInfo.id),
      enabled: !!userInfo.id
  });
    useEffect(() => {
      refetchGoals()
    }, [])

    useEffect(() => {
      console.log("ACTIVE TAB DATA:", activeTabData)
    }, [activeTabData, pageData]);

    useEffect(() => {
      console.log("GOAL DATA::", goalData)
    }, [goalData]);


    if(goalStatus === 'pending'){
      <div>Loading</div>
    }

    if(goalStatus === 'error'){
      <div>{goalError.message}</div>
    }

    return(
        <div className={styles.sidepanelWrapper}>
          {activeGoal 
            ? <GoalView 
                goal={activeGoal}
                setActiveGoal={setActiveGoal}
                activeTabData={activeTabData}
            />
            :
              <>
              {goalData?.goals && goalData.goals.map((goal)=>
                  <GoalCard
                      key={goal.id}
                      goal={goal}
                      isActive={activeGoal && activeGoal.id === goal.id}
                      setActiveGoal={setActiveGoal}
                  />
              )}
            </>
          }
        <p onClick={()=>setActiveGoal(null)}>Back</p>
        </div>
    )
}