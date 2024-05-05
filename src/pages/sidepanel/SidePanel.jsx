import '@pages/sidepanel/SidePanel.css';
import { useState, useEffect } from 'react';
import styles from "@pages/sidepanel/SidePanel.module.css"
import GoalView from './GoalView/GoalView.jsx';
import { useQuery } from '@tanstack/react-query'
import useActiveTabDataUpdater from './hooks/useActiveTabData.js';

import { fetchGoals } from "../api-funcs/goals.js"
// import { injectContentScript } from './ContentScriptControls/injectContentScript.js';
import { useInjectContentScript } from './ContentScriptControls/useInjectContentScript.js';
import ContentScriptControls from './ContentScriptControls/ContentScriptControls.jsx';
import SidepanelHomepage from './SidepanelHomepage/SidepanelHomepage.jsx';
import { FocusProvider } from "./FocusProvider/FocusProvider.jsx";
import ExtensionSyncProvider from './ExtensionSyncProvider/ExtensionSyncProvider.jsx';

export default function SidePanel(props){
    const [activeGoal, setActiveGoal] = useState(null)
    const [userInfo, setUserInfo] = useState({id: null, email: null});
  
    const { activeTabData, pageData, rawPageData } = useActiveTabDataUpdater();
    const { injectedDomains, domain } = useInjectContentScript(activeTabData.tabURL, activeTabData.tabID);

  //   useEffect(()=>{
  //     console.log("INJECTED DOMAINS", injectedDomains)
  // }, [injectedDomains])


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

    // useEffect(() => {
    //   console.log("RAW PAGE DATA:", rawPageData)
    // }, [rawPageData]);

    // useEffect(() => {
    //   console.log("GOAL DATA:", goalData)
    // }, [goalData]);

    // useEffect(() => {
    //   console.log("USER INFO:", userInfo)
    // }, [userInfo]);

    return(
      <ExtensionSyncProvider>
        <FocusProvider>
          <div className={styles.sidepanelWrapper}>
            {activeGoal 
              ? <GoalView 
                  goal={goalData.goals.filter(goal => goal.id === activeGoal.id)[0]}
                  setActiveGoal={setActiveGoal}
                  activeTabData={activeTabData}
                  pageData={pageData}
                  goals={goalData.goals}
                />
              :
              <>
                <SidepanelHomepage 
                  goals={goalData?.goals}
                  goalStatus={goalStatus}
                  activeGoal={activeGoal}
                  setActiveGoal={setActiveGoal}
                />
                {/* <ContentScriptControls domain={domain} injectedDomains={injectedDomains}/> */}
              </>

            }
          </div>
        </FocusProvider>
      </ExtensionSyncProvider>
    )
}