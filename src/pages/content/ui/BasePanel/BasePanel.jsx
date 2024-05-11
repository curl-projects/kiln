import React, { useState, useEffect } from 'react';


// BasePanel now accepts a props object with a config specifying the keys to listen for
export default function BasePanel({ config, type }) {
  const [storedData, setStoredData] = useState({});

  // Function to load data from storage initially based on the keys in the config
  const loadStoredData = () => {
    // Retrieve only the keys specified in the config
    chrome.storage.local.get(config.keys, (result) => {
      const initialData = {};
      config.keys.forEach((key) => {
        if (result[key] !== undefined) {
          initialData[key] = result[key];
        }
        else{
            console.warn(`Warning: Key '${key}' is missing from storage. ${type} Component`);
        }
      });
      setStoredData(initialData);
    });
  };

// Function to update component state when storage changes
  const handleStorageChange = (changes, areaName) => {
    console.log("Handling storage change")
    if (areaName === 'local') {
      let hasChanges = false;
      const newData = { ...storedData };

      config.keys.forEach((key) => {
        if (changes[key]) {
          newData[key] = changes[key].newValue;
          hasChanges = true;
        } else if (newData[key] === undefined) {
          console.warn(`Warning: Key '${key}' is missing from the updated storage data.`);
        }
      });

      if (hasChanges) {
        setStoredData(newData);
      }
    }
  };


  // Initialize data and set up the listener
  useEffect(() => {
    loadStoredData();
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Clean up the listener on component unmount
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  useEffect(()=>{
    console.log(`Stored Data (${type}):`, storedData)
  }, [storedData])

  return (
    <div>
      <h1>Stored Data</h1>
      <pre>{JSON.stringify(storedData, null, 2)}</pre>
    </div>
  );
}
