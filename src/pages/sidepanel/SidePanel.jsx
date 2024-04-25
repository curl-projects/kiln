import React, { useState , useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const SidePanel = props => {
  const theme = useStorage(exampleThemeStorage);
  const [pageData, setPageData] = useState('');
  const [activeURL, setActiveURL] = useState('');

  (async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    setActiveURL(tab.url);
  })();

  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.active) {
      console.log("======= active tab url", tab.url);
      setActiveURL(tab.url);
    }
  });
  
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.active) {
      console.log("======= active tab url", tab.url);
      setActiveURL(tab.url);
    }
  });
  





  useEffect(() => {
    console.log('Page Data', pageData);
  }, [pageData]);



  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.messageDestination === 'sidePanel' && request.messageType === 'websiteContent') {
      request.pageData ? setPageData(request.pageData) : console.error("No page data found in request")
    }
  });

  // HANDLE URL AND TAB CHANGES


  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
        <div style={{
          height: '300px',
          width: "100%",
          overflow: "scroll",
          fontSize: "8px",
        }}>
          {/* <p>
            {pageData && pageData.map(e => e.text).join('')}
          </p> */}
          <h1>Active URL: {activeURL}</h1>
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
