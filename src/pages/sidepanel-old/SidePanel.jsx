import '@pages/sidepanel/SidePanel.css';
import { useState, useEffect } from 'react';
import styles from '@pages/sidepanel/SidePanel.module.css';
import GoalView from './GoalView/GoalView.jsx';
import { useQuery } from '@tanstack/react-query';
import useActiveTabDataUpdater from './hooks/useActiveTabData.js';

import { fetchGoals } from '../api-funcs/goals.js';
// import { injectContentScript } from './ContentScriptControls/injectContentScript.js';
import { useInjectContentScript } from './ContentScriptControls/useInjectContentScript.js';
import ContentScriptControls from './ContentScriptControls/ContentScriptControls.jsx';
import SidepanelHomepage from './SidepanelHomepage/SidepanelHomepage.jsx';
import { useScriptSync } from './ExtensionSyncProvider/ExtensionSyncProvider.jsx';
import { GoalDataProvider } from './GoalDataProvider/GoalDataProvider.jsx';
import Fish from "@pages/content/ui/SwimmingComponent/Fish.jsx"

export default function SidePanel(props) {
  const [activeGoal, setActiveGoal] = useState(null);
  const [userInfo, setUserInfo] = useState({ id: null, email: null });
  const { useAutoUpdateSyncState } = useScriptSync();

  const { activeTabData, pageData, rawPageData } = useActiveTabDataUpdater();
  const { injectedDomains, domain } = useInjectContentScript(activeTabData.tabURL, activeTabData.tabID);

  useAutoUpdateSyncState({ injectedDomains })
  useAutoUpdateSyncState({ domain })

  useEffect(() => {
    console.log("INJECTED DOMAINS:", injectedDomains);
  }, [injectedDomains]);
  
  useEffect(() => {
    console.log("DOMAIN:", domain);
  }, [domain]);

  
  useEffect(() => {
    chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (profileInfo) {
      setUserInfo({ ...userInfo, id: profileInfo.id, email: profileInfo.email });
    });
  }, []);

  const {
    status: goalStatus,
    data: goalData,
    error: goalError,
    refetch: refetchGoals,
  } = useQuery({
    queryKey: ['goals', userInfo],
    queryFn: () => fetchGoals(userInfo.id),
    enabled: !!userInfo.id,
  });

  useEffect(() => {
    refetchGoals();
  }, []);



  // useEffect(() => {
  //   console.log("RAW PAGE DATA:", rawPageData)
  // }, [rawPageData]);

  useEffect(() => {
    console.log("GOAL DATA:", goalData)
  }, [goalData]);

  // useEffect(() => {
  //   console.log("USER INFO:", userInfo)
  // }, [userInfo]);

  return (
      <GoalDataProvider goalData={goalData}>
        <div className={styles.sidepanelWrapper}>
          {activeGoal ? (
            <GoalView
              goal={goalData.goals.filter(goal => goal.id === activeGoal.id)[0]}
              setActiveGoal={setActiveGoal}
              activeTabData={activeTabData}
              pageData={pageData}
              goals={goalData.goals}
            />
          ) : (
            <>
              <SidepanelHomepage
                goals={goalData?.goals}
                goalStatus={goalStatus}
                activeGoal={activeGoal}
                setActiveGoal={setActiveGoal}
              />
              <ContentScriptControls domain={domain} injectedDomains={injectedDomains}/>
              <div style={{
                height: "300px",
                width: "300px",
                border: "2px solid green",
                position: "absolute",
                top: 0,
                bottom: 0,
              }}>
                {/* <Fish width={300} height={300}/> */}

              </div>
            </>
          )}
        </div>
      </GoalDataProvider>
  );
}