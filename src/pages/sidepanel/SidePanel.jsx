import React, { useState , useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import * as cheerio from "cheerio";
import { addListener } from 'process';

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

  // useEffect(() => {
  //   console.log("PAGE DATA:", pageData)
  // }, [pageData]);

  useEffect(() => {
    console.log("TAB DATA:", activeTabData)
  }, [pageData]);

  useEffect(() => {
    chrome.identity.getProfileUserInfo({accountStatus: 'ANY'}, function(userInfo){
      console.log('USER INFO', JSON.stringify(userInfo))
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
          console.log("TEXTELS (ACTIVATED):", textEls);
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
          console.log("TEXTELS (ACTIVATED):", textEls);
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
            // console.log("EXECUTE SCRIPT (ACTIVATED):", activeInfo.tabId)
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

  async function fetchGoals(){
    console.log("FETCHING GOALS!")
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
          height: '200px',
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
          height: '200px',
          width: "100%",
          overflow: "scroll",
          fontSize: "8px",
          border: "2px solid black",
        }}>
          <p>
            Hello!
          </p>
  
        </div>
        <button onClick={fetchGoals}>Click here to fetch goals</button>
        
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> An error has occurred </div>);


// TAB ACTIVATED
  // chrome.tabs.onActivated.addListener(async (activeInfo) => {
  //   const tab = await chrome.tabs.get(activeInfo.tabId);
  //   console.log("ACTIVE INFO:", activeInfo)
  //   if (tab && tab.active && activeInfo?.changeInfo.status === 'complete') {
  //     console.log("======= active tab url", tab.url);
  //     setActiveURL(tab.url);
  //     setActiveTabID(activeInfo.tabId);
  //   }

  // });

  // // TAB UPDATED
  // chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  //   if (changeInfo.status === 'complete' && tab.active) {
  //     console.log("======= active tab url", tab.url);
  //     tab.url && setActiveURL(tab.url);
  //     setActiveTabID(tabId);
  //   }
  //   changeInfo.status == 'complete' && console.log("URL changed (Tab Updated) ")
  // });

  // useEffect(() => {

  //   console.log("SENDING NEW MESSAGE!");

  //   (async() => {
  //     try{
  //       const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  //         if(tab && tab.id && tab.active){
  //         console.log("ACTIVE TAB ID:", activeTabID)
  //         console.log("REPORTED TAB:", tab.id)

          // var response = await chrome.tabs.sendMessage(tab.id, {
          //   messageDestination: "pageContent",
          //   chromeMessageType: "getWebsiteContent",
          // })
      
  //         console.log("Response:", response)
      
  //         if(response.chromeMessageType === 'websiteContent'){
  //           console.log("Content response:", response.pageData || [])
  //           setPageData(response.pageData || [])
  //         }

  //         // chrome.scripting.executeScript({
  //         //   target: {tabId: tab.id, 
  //         //     // allFrames: true
  //         //   },
  //         //   func: readPageContentScript,
  //         // }).then((response) => 
  //         //   console.log("Script Response:", response)
  //         // )

  //         // chrome.scripting.executeScript(
  //         //   target: {tabId: id, allFrames: true}, 
  //         //   {file: '/pages/content/injected/pageContent.ts'}, ([response]) => {
  //         //   console.log("HI!!")
  //         //   if(response.chromeMessageType === 'websiteContent'){
  //         //     console.log("Content response:", response.pageData || [])
  //         //     setPageData(response.pageData || [])
  //         //   }
  //         // });
  //       }
  //     }catch(e){
  //       console.error("Error:", e)
  //       setPageError("Error fetching page data")
  //     }

    
  //     })();
  
  //     setPageError('')
  // }, [activeURL]);
  

  // // HANDLE URL AND TAB CHANGES


  // UPDATING
  // chrome.tabs.onUpdated.addListener(async function updatedListener(tabId, change, tab){

  //   console.log("TAB DATA:", tab.active, change)
  //   if(tab.active && change.status === 'complete'){
  //     chrome.tabs.get(tabId, function(tab){
  //           setActiveURL(tab.url)
  //           console.log("SET LOCATION (UPDATED):", tab.url)
  //             // console.log("EXECUTE SCRIPT (ACTIVATED):", activeInfo.tabId)
  //             setPageData([{text: "Loading"}])
  //             chrome.scripting.executeScript({
  //               target: {tabId: tabId, allFrames: false}, 
  //               func: (()=>{return document.documentElement.innerHTML}),
  //       }).then(injectionResults => {
  //         const {frameId, result} = injectionResults[0]
  //         const $ = cheerio.load(result);
  //         var textEls = []
  //         const $textEls = $('p, h1, h2, h3').each(function(i, el){
  //                 textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
  //               })
  //         console.log("TEXTELS (UPDATED):", textEls);
  //         setPageData(textEls)
  //       })
  //     })
  //   }
  //   if(tab.active && change.status === 'loading'){
  //     chrome.tabs.onUpdated.removeListener(updatedListener);
  //   }

  //   return true;
  // });