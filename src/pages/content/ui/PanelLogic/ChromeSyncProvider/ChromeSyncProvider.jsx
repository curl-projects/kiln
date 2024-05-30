import { createContext, useState, useContext, useEffect } from 'react';

export const ChromeSyncContext = createContext();


export default function ChromeSyncProvider({ config, type, children }) {
  const [storedData, setStoredData] = useState({});

  // Function to load data from storage
  const loadStoredData = () => {
    chrome.storage.local.get(config.keys, (result) => {
      const initialData = {};
      config.keys.forEach(key => {
        initialData[key] = result[key] !== undefined ? result[key] : null;
        if (result[key] === undefined) {
          console.warn(`Warning: Key '${key}' is missing from storage. ${type} Component`);
        }
      });
      setStoredData(initialData);
    });
  };

  // Function to send a mutation request to background.js
  const mutate = (endpoint, data) => {
    chrome.runtime.sendMessage(
      { action: 'mutate', endpoint, data },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error during mutation:', chrome.runtime.lastError.message);
        } else if (response.success) {
          console.log('Mutation succeeded:', response);
        } else {
          console.error('Mutation failed:', response.error);
        }
      }
    );
  };

  const stream = (options) => {
    const { endpoint, data, promptType, streamName } = options;
    
    chrome.runtime.sendMessage(
      {
        action: 'stream', 
        endpoint,
        data,
        promptType,
        streamName,
      },
    );
  };

  // Set up storage listener
  useEffect(() => {
    loadStoredData();
    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local') {
        const newData = { ...storedData };
        let hasChanges = false;
        config.keys.forEach(key => {
          if (changes[key]) {
            newData[key] = changes[key].newValue;
            hasChanges = true;
          }
        });
        if (hasChanges) {
          setStoredData(newData);
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [config.keys]);

  // Dynamically construct the context value
  const contextValue = { mutate, stream };
  config.keys.forEach(key => {
    contextValue[key] = storedData.hasOwnProperty(key) ? storedData[key] : null;
  });

  return (
    <ChromeSyncContext.Provider value={contextValue}>
      {children}
    </ChromeSyncContext.Provider>
  );
}