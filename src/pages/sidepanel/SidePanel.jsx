import React, { useState , useEffect } from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/sidepanel/SidePanel.css';
import useStorage from '@src/shared/hooks/useStorage';
import exampleThemeStorage from '@src/shared/storages/exampleThemeStorage';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';

const SidePanel = props => {
  const [myState, setMyState] = useState('');

  const theme = useStorage(exampleThemeStorage);

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    setMyState(request.message);
    console.log('REQUEST:', request);
  });

  useEffect(() => {
    console.log('STATE:', myState);
  }, [myState]);

  useEffect(() => {
    console.log('RUNNING');
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      console.log('REQUEST:', request);
    });
  }, []);

  return (
    <div
      className="App"
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}>
      <header className="App-header" style={{ color: theme === 'light' ? '#000' : '#fff' }}>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/sidepanel/SidePanel.tsx</code> and save to reload.
        </p>
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
