import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentSyncContext = createContext();

export default function ContentSyncProvider({ children }) {
  const [syncState, setSyncState] = useState({});

  // useEffect(() => {
  //     console.log("CONTENT SYNC STATE:", syncState)
  // }, [syncState]);

  useEffect(() => {
    // Listener for state updates from other parts of the extension
    const handleMessage = (request, sender, sendResponse) => {
      if (request.type === 'update-state') {
        setSyncState(prevState => ({ ...prevState, ...request.newState }));
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up the listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const triggerExtensionAction = action => {
    console.log('ACTION TRIGGERED');
    chrome.runtime.sendMessage({ type: 'update-action', action: action });
  };


  return (
    <ContentSyncContext.Provider
      value={{ syncState, setSyncState, triggerExtensionAction }}>
      {children}
    </ContentSyncContext.Provider>
  );
}

export function useExtensionSync() {
  return useContext(ContentSyncContext);
}
