import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

console.log('background loaded');

const baseURL = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}`; // Replace with your base domain

reloadOnUpdate('pages/background');
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

chrome.storage.local.set({finnKey: "hello"});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

// Initial requests following user info
chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (profileInfo) {
    // Store user info in Chrome local storage
    chrome.storage.local.set({
        userId: profileInfo.id,
        userEmail: profileInfo.email
    }, () => {
        // Perform data fetch
        query('retrieve-goals', {
            userId: profileInfo.id
        });
    });
});

// Message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'query':
            query(message.endpoint, message.params)
                .then((data) => {
                    sendResponse({ success: true, data });
                })
                .catch(error => {
                    sendResponse({ success: false, error: error.message });
                });
            // Return true to indicate an asynchronous response
            return true;
        case 'mutate':
            mutate(message.endpoint, message.data)
                .then((data) => {
                    sendResponse({ success: true, data });
                })
                .catch(error => {
                    sendResponse({ success: false, error: error.message });
                });
            // Return true to indicate an asynchronous response
            return true;
        case 'stream':
            break;
        case 'run':
            break;
        default:
            console.error(`Invalid action sent from ${sender}`);
    }
});

function storeObjectInChromeStorage(dataObject) {
    return new Promise((resolve, reject) => {
        // Ensure the input is an object
        if (typeof dataObject === 'object' && dataObject !== null) {
            // Prepare the data to be stored
            let storageData = {};
            for (const [key, value] of Object.entries(dataObject)) {
                storageData[key] = value;
            }

            // Save to Chrome storage
            chrome.storage.local.set(storageData, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log('Data saved to local storage:', storageData);
                    resolve();
                }
            });
        } else {
            reject('Input data is not an object');
        }
    });
}

// Query function
async function query(endpoint, params = {}) {
    console.log("Query Executing", endpoint);
    try {
        // Build query string for GET parameters
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${baseURL}/${endpoint}?${queryString}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        await storeObjectInChromeStorage(data);

        return data;
    } catch (error) {
        console.error('Error during query:', error);
        throw error;
    }
}

// Mutate function
async function mutate(endpoint, data = {}) {
    try {
        const response = await fetch(`${baseURL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        await storeObjectInChromeStorage(responseData);

        return responseData;
    } catch (error) {
        console.error('Error during mutation:', error);
        throw error;
    }
}
