import React, { createContext, useContext, useState, useEffect } from 'react';

const ExtensionSyncContext = createContext();

export default function ExtensionSyncProvider({ children }) {
  const [syncState, setSyncState] = useState({});
  const [scriptAction, setScriptAction] = useState(null);

  // Helper function to check if states are equal
  const statesAreEqual = (prevState, newState) => {
    return JSON.stringify(prevState) === JSON.stringify(newState);
  }

  useEffect(()=>{
    console.log("SYNC STATE:", syncState)
  }, [syncState])

  useEffect(() => {
    // Listener for state updates from other parts of the extension
    const handleMessage = (request, sender, sendResponse) => {
      console.log('HANDLING MESSAGE:', request);
      console.log('PRIOR SYNC STATE', syncState);
      if (request.type === 'update-state') {
        setSyncState(prevState => {
          const updatedState = { ...prevState, ...request.newState };
          return statesAreEqual(prevState, updatedState) ? prevState : updatedState;
        });
      } else if (request.type === 'update-action') {
        if (scriptAction !== request.action) {
          setScriptAction(request.action);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    // Clean up the listener when the component unmounts
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [scriptAction]);

  // Function to update state and notify other parts of the extension
  const triggerScriptUpdateState = newState => {
    setSyncState(prevState => {
      const updatedState = { ...prevState, ...newState };
      return statesAreEqual(prevState, updatedState) ? prevState : updatedState;
    });

    // Send message to other parts of the extension
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'update-state', newState });
    });
  };

  const useAutoUpdateSyncState = (dependencies) => {
    useEffect(() => {
      triggerScriptUpdateState(dependencies);
    }, Object.values(dependencies));
  };

  return (
    <ExtensionSyncContext.Provider
      value={{ syncState, setSyncState, triggerScriptUpdateState, useAutoUpdateSyncState, scriptAction }}>
      {children}
    </ExtensionSyncContext.Provider>
  );
}

export function useScriptSync() {
  return useContext(ExtensionSyncContext);
}