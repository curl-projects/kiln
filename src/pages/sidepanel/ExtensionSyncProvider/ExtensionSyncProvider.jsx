import React, { createContext, useContext, useState, useEffect } from 'react';

const  ExtensionSyncContext = createContext();

export default function ExtensionSyncProvider({ children }){
    const [syncState, setSyncState] = useState({})
    const [scriptAction, setScriptAction] = useState(null);

    // useEffect(() => {
    //     console.log("EXTENSION SYNC STATE:", syncState)
    // }, [syncState]);

    useEffect(() => {
        // Listener for state updates from other parts of the extension
        const handleMessage = (request, sender, sendResponse) => {
            console.log("HANDLING MESSAGE:", request)
            console.log("PRIOR SYNC STATE", syncState)
          if (request.type === 'update-state') {
            setSyncState(prevState => ({ ...prevState, ...request.newState }));
          }
          else if(request.type === 'update-action'){
            setScriptAction(request.action)
          }
        };
    
        chrome.runtime.onMessage.addListener(handleMessage);
    
        // Clean up the listener when the component unmounts
        return () => {
          chrome.runtime.onMessage.removeListener(handleMessage);
        };
      }, []);
    
    // Function to update state and notify other parts of the extension
    const triggerScriptUpdateState = (newState) => {
        setSyncState(prevState => ({ ...prevState, ...newState }));

        // Send message to other parts of the extension
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'update-state', newState })
        });
    };

    const useAutoUpdateSyncState = (dependencies) => {
        useEffect(() => {
            triggerScriptUpdateState(dependencies);
        }, Object.values(dependencies));
    };


    // Any other message functions can be added here
    // const sendMessageToContentScript = (message) => {
    //     chrome.runtime.sendMessage(message);
    // };

      return (
        <ExtensionSyncContext.Provider value={{syncState, setSyncState, triggerScriptUpdateState, useAutoUpdateSyncState, scriptAction}}>
            {children}
        </ExtensionSyncContext.Provider>
      )

    
}

export function useScriptSync(){
    return useContext(ExtensionSyncContext)
}