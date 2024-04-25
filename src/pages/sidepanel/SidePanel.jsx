import React, { useState , useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

import * as cheerio from "cheerio";
import { addListener } from 'process';

const SidePanel = props => {
  const theme = useStorage(exampleThemeStorage);
  const [pageData, setPageData] = useState('');
  const [pageError, setPageError] = useState('');
  const [activeURL, setActiveURL] = useState('');
  const [activeTabID, setActiveTabID] = useState('');

  useEffect(() => {
    console.log("PAGE DATA:", pageData)
  }, [pageData]);

  // ACTIVATION
  chrome.tabs.onActivated.addListener(async function activatedListener(activeInfo){
    chrome.tabs.onActivated.removeListener(activatedListener);
      chrome.tabs.get(activeInfo.tabId, function(tab){
          setActiveURL(tab.url)
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
  chrome.tabs.onUpdated.addListener(async function updatedListener(tabId, change, tab){
    chrome.tabs.onUpdated.removeListener(updatedListener);
    if(tab.active && change.url){
      chrome.tabs.get(tabId, function(tab){
            setActiveURL(tab.url)
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
  });

  // // TAB CREATION
  // useEffect(async () => {
  //   const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  //   if(tab){
  //     setActiveURL(tab.url)
  //     setActiveTabID(tab.tabId)
  //   };

  //   tab && tab.active && console.log("URL changed (Tab Creation) ")

  // }, []);



  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
        <p>Active URL: {activeURL}</p>
        <p>Active Tab ID: {activeTabID}</p>
        {pageError && <p style={{'color': 'red'}}>Page Error: {pageError}</p>}
        <div style={{
          height: '300px',
          width: "100%",
          overflow: "scroll",
          fontSize: "8px",
        }}>
          <p>
            {pageData && pageData.map(e => e.text).join('')}
          </p>
  
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === 'light' && '#0281dc', marginBottom: '10px' }}>
          Learn React!
        </a>
        <button id="read-content">Action</button>
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
