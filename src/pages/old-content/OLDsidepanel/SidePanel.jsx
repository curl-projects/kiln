import React, { useState , useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import styles from "@pages/sidepanel/SidePanel.module.css"
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import cheerio from "cheerio";

import AIOrchestration from './AIOrchestration/AIOrchestration';
import GoalCardOne from './GoalCardVariants/GoalCardOne/GoalCardOne.jsx';
import GoalCardTwo from './GoalCardVariants/GoalCardTwo/GoalCardTwo.jsx';
import GoalCardDetail from './GoalCardDetail/GoalCardDetail.jsx';

function domain_from_url(url) {
  var result
  var match
  if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
      result = match[1]
      if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
          result = match[1]
      }
  }
  return result
}

const SidePanel = props => {
  const theme = useStorage(exampleThemeStorage);
  const [pageError, setPageError] = useState('');
  const [activeURL, setActiveURL] = useState('');
  const [activeTabID, setActiveTabID] = useState('');
  const [activeTabData, setActiveTabData] = useState({tabID: null, tabTitle: null, tabURL: null, windowId: null});
  const [pageData, setPageData] = useState(null);
  const [userInfo, setUserInfo] = useState({id: null, email: null});
  const [goals, setGoals] = useState([])
  const [activeGoal, setActiveGoal] = useState(null);
  const [activeGoalSummary, setActiveGoalSummary] = useState("")
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [goalRanking, setGoalRanking] = useState(null)

  // useEffect(() => {
  //   console.log("PAGE DATA:", pageData)
  // }, [pageData]);

  useEffect(() => {
    console.log("TAB DATA:", activeTabData)
  }, [activeTabData]);

  useEffect(() => {
    console.log("GOAL RANKING:", goalRanking)
  }, [goalRanking]);
  
  // useEffect(() => {
  //   console.log("USER INFO:", userInfo)
  // }, [userInfo]);

  useEffect(() => {
    console.log("ACTIVE GOAL:", activeGoal)
  }, [activeGoal]);

  useEffect(() => {
    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(profileInfo){
      setUserInfo({...userInfo, id: profileInfo.id, email: profileInfo.email})
    })
  }, []);

  useEffect(() => {
    async function fetchGoals(){
        if(userInfo?.id){
        console.log("USERINFO:", userInfo)
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/retrieve-goals?userId=${userInfo.id}`, {method: "GET"})
        const responseJSON = await response.json();
        if(responseJSON.success){
          setGoals(responseJSON.goals)
        }
        console.log("RESPONSE JSON:", responseJSON)
    }
    }

    fetchGoals().catch(console.error)
  }, [userInfo])


// CONTENT REFRESH
  useEffect(async () => {
  // SIDEBAR CREATION
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if(tab){
      console.log("FIRST TIME!")
      setActiveTabData({...activeTabData, tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId})
      setPageData([{text: "Loading"}])
      
      chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: false}, 
        func: (()=>{return document.documentElement.innerHTML}),
        }).then(injectionResults => {
        const {frameId, result} = injectionResults[0]
          const $ = cheerio.load(result);
          var textEls = []
          const $textEls = $('p, h1, h2, h3').each(function(i, el){
                  textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
                })
          console.log("SECOND TIME!")
          setPageData(textEls)
      })
    };

  // ACTIVATION
  chrome.tabs.onActivated.addListener(async function activatedListener(activeInfo){
      chrome.tabs.get(activeInfo.tabId, function(tab){ 
          setActiveTabData({tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId})
          setPageData([{text: "Loading"}])
          console.log("SET LOCATION (ACTIVATED):", tab.url)
            // console.log("EXECUTE SCRIPT (ACTIVATED):", activeInfo.tabId)
            chrome.scripting.executeScript({
              target: {tabId: activeInfo.tabId, allFrames: false}, 
              func: (()=>{return document.documentElement.innerHTML}),
      }).then(injectionResults => {
        const {frameId, result} = injectionResults[0]
          const $ = cheerio.load(result);
          var textEls = []
          const $textEls = $('p, h1, h2, h3').each(function(i, el){
                  textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
                })
          setPageData(textEls)

      })
    })

  });

  // UPDATING
chrome.tabs.onUpdated.addListener(function updatedListener(tabId, changeInfo, tab) {
  if(tab.active && changeInfo.status === 'complete'){
    chrome.tabs.get(tabId, function(tab){
        setActiveTabData({tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId, tabWebsite: null})
        setPageData([{text: "Loading"}])
          console.log("SET LOCATION (UPDATED):", tab.url)
            chrome.scripting.executeScript({
              target: {tabId: tabId, allFrames: false}, 
              func: (()=>{return document.documentElement.innerHTML}),
      }).then(injectionResults => {
        const {frameId, result} = injectionResults[0]
        const $ = cheerio.load(result);
        var textEls = []
        const $textEls = $('p, h1, h2, h3').each(function(i, el){
                textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
              })
        // console.log("TEXTELS (UPDATED):", textEls);
        setPageData(textEls)
      })
    })
  }
  // chrome.tabs.onUpdated.addListener(updatedListener);
});
  }, []);

  function makeGoalActive(goalId){
    if(activeGoal && activeGoal.id === goalId){
      setActiveGoal(null)
    }
    else{
      setActiveGoal(goals.filter(goal => goal.id === goalId)[0])
    }
  }


  return (
    <div className={styles.sidepanelWrapper}>
        <div className={styles.panelTopAccentWrapper}>
          <div className={styles.accentTopEyebrowWrapper}>
            <p className={styles.accentEyebrow}>Ariadne</p>
            <div style={{flex: 1}}/>
            <div className={styles.accentTopIconWrapper} 
            style={{cursor: "pointer"}}
            onClick={()=>setMetadataOpen(prevState => !prevState)}>
              <div className={styles.smallCircle} style={{backgroundColor: "#FEAC85"}}/>
              <div className={styles.smallCircle} style={{backgroundColor: "#BEBEBC"}}/>
              <div className={styles.smallCircle} style={{backgroundColor: "#344148"}}/>
            </div>
          </div>
          <div className={styles.accentLine}/>
          <p className={styles.accentSecondaryEyebrow}>{activeTabData.tabTitle || "Unknown"}</p>
        </div>
        {metadataOpen && 
          <div className={styles.metadataPanel}>
             <div className={styles.metadataInnerPanel}>
              <p className={styles.metadataText}>
                {activeTabData.tabTitle || "Unknown"}
              </p>
            </div>
            <div className={styles.metadataInnerPanel}>
              <p className={styles.metadataText}>
                {pageData ? pageData.map(e => e.text).join('') : "No text found"}
              </p>
            </div>
            <div className={styles.metadataInnerPanel}>
            </div>
          </div>
        }
        <div className={styles.mainTextWrapper}>
          <h1 className={styles.mainText}>{activeGoalSummary}</h1>
          <div className={styles.mainTextLine}/>
        </div>
  
        <div className={styles.goalsWrapper}>
          <div className={styles.goalsInnerWrapper}>
            {goals && goals.map((goal)=>
              <GoalCardTwo
                key={goal.id}
                id={goal.id}
                category={goal.category}
                description={goal.description}
                title={goal.title}
                isActive={activeGoal && activeGoal.id === goal.id}
                makeGoalActive={makeGoalActive}
                goalRanking={goalRanking && goalRanking[goal.id]}
              />
            )}
          </div>
        {activeGoal &&
            <GoalCardDetail 
              activeGoal={activeGoal}
              activeGoalSummary={activeGoalSummary}
              />
          }
          <AIOrchestration
                goals={goals}
                activeTabData={activeTabData}
                pageData={pageData}
                activeGoal={activeGoal}
                setActiveGoalSummary={setActiveGoalSummary}
                setGoalRanking={setGoalRanking}
                setActiveGoal={setActiveGoal}
              />
        </div>



 {/* <div className={styles.descriptionTextWrapper'>
          <p className={styles.descriptionText'>
            <span className={styles.descriptionTextPast'>

            </span>
            <span className={styles.descriptionTextPresent'>
              Hello, welcome to the extension.
            </span>
          </p>
        </div> */}

      {/* <header className="App-header" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
        <p>Active URL: {activeTabData.tabURL}</p>
        <p>Active Tab ID: {activeTabData.tabID}</p>
        <p>Title: {activeTabData.tabTitle}</p>
        <p>Website: {activeTabData?.tabURL && domain_from_url(activeTabData.tabURL)}</p>
        {pageError && <p style={{'color': 'red'}}>Page Error: {pageError}</p>}
        <div style={{
          height: '100px',
          width: "100%",
          overflow: "scroll",
          fontSize: "8px",
          border: "2px solid black",
        }}>
          <p>
            {pageData && pageData.map(e => e.text).join('')}
          </p>
  
        </div>
        <div style={{
          height: '100px',
          width: "100%",
          overflow: "scroll",
          fontSize: "8px",
          border: "2px solid black",
        }}>
          {goals.map((goal)=>
          <div key={goal.id}>
          <h3>
            {goal.title}
          </h3>
          <p>
            {goal.description}
          </p>
          <div style={{height: "10px"}}/>
          </div>
          )}
        </div>
        <div style={{
          height: '100px',
          width: "100%",
          overflow: "scroll",
          fontSize: "8px",
          border: "2px solid black",
        }}>
          <ChatResponse />
        </div>
        <button onClick={fetchGoals}>Click here to refetch goals</button>
        
      </header> */}
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> An error has occurred </div>);