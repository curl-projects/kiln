import React, { createContext, useContext, useState, useEffect } from 'react';

const  ContentSyncContext = createContext();

export default function ContentSyncProvider({ children }){
    const [syncState, setSyncState] = useState({})
    
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
    
    // Function to update state and notify other parts of the extension
    const triggerExtensionUpdateState = (newState) => {
        setSyncState(prevState => ({ ...prevState, ...newState }));
        // Send message to other parts of the extension
        chrome.runtime.sendMessage({ type: 'update-state', newState });
    };

    const triggerExtensionAction = (action) => {
        console.log("ACTION TRIGGERED")
        chrome.runtime.sendMessage({ type: 'update-action', action: action })
    }

    const useAutoUpdateSyncState = (dependencies) => {
        useEffect(() => {
            triggerScriptUpdateState(dependencies);
        }, Object.values(dependencies));
    };

 
      return (
        <ContentSyncContext.Provider value={{syncState, setSyncState, triggerExtensionUpdateState, useAutoUpdateSyncState, triggerExtensionAction}}>
            {children}
        </ContentSyncContext.Provider>
      )

    
}

export function useExtensionSync(){
    return useContext(ContentSyncContext)
}