import React, { useState , useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import * as cheerio from "cheerio";
import { ChatResponse } from './ChatResponse/ChatResponse';

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
  const [pageData, setPageData] = useState('');
  const [pageError, setPageError] = useState('');
  const [activeURL, setActiveURL] = useState('');
  const [activeTabID, setActiveTabID] = useState('');
  const [activeTabData, setActiveTabData] = useState({tabID: null, tabTitle: null, tabURL: null, windowId: null});
  const [userInfo, setUserInfo] = useState({id: null, email: null});
  const [goals, setGoals] = useState([])

  // useEffect(() => {
  //   console.log("PAGE DATA:", pageData)
  // }, [pageData]);

  useEffect(() => {
    console.log("TAB DATA:", activeTabData)
  }, [pageData]);
  
  useEffect(() => {
    console.log("USER INFO:", userInfo)
  }, [userInfo]);

  useEffect(() => {
    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(profileInfo){
      setUserInfo({...userInfo, id: profileInfo.id, email: profileInfo.email})
      fetchGoals(profileInfo.id)
    })
  }, []);


// CONTENT REFRESH
  useEffect(async () => {
  // SIDEBAR CREATION
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if(tab){
      setActiveTabData({tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId})
      
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
          setPageData(textEls)
      })
    };

  // ACTIVATION
  chrome.tabs.onActivated.addListener(async function activatedListener(activeInfo){
      chrome.tabs.get(activeInfo.tabId, function(tab){ 
          setActiveTabData({tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId})
          console.log("SET LOCATION (ACTIVATED):", tab.url)
            // console.log("EXECUTE SCRIPT (ACTIVATED):", activeInfo.tabId)
            setPageData([{text: "Loading"}])
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
          console.log("SET LOCATION (UPDATED):", tab.url)
            setPageData([{text: "Loading"}])
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
        console.log("TEXTELS (UPDATED):", textEls);
        setPageData(textEls)
      })
    })
  }
  // chrome.tabs.onUpdated.addListener(updatedListener);
});
  }, []);

  async function fetchGoals(userId){
    console.log("FETCHING GOALS!")
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/retrieve-goals?userId=${userId}`, {method: "GET"})
    
    const responseJSON = await response.json();
    if(responseJSON.success){
      setGoals(responseJSON.goals)
    }
  
    console.log("RESPONSE JSON:", responseJSON)
  }



  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
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
        
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> An error has occurred </div>);