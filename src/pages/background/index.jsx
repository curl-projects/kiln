import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

console.log('background loaded');

const baseURL = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}`; // Replace with your base domain

reloadOnUpdate('pages/background');
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }).catch(error => console.error(error));

// // Initial requests following user info
// chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (profileInfo) {
//     // Store user info in Chrome local storage
//     chrome.storage.local.set({
//         userId: profileInfo.id,
//         userEmail: profileInfo.email
//     }, () => {
//         // Perform data fetch
//         query('retrieve-goals', {
//             userId: profileInfo.id
//         });
//     });
// });

// Message listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === 'save'){
        console.log("SAVED!")
        chrome.storage.local.set({
            'kiln': message.snapshot,
        })
    }  

    else if(message.action === 'retrieve'){
        console.log("RETRIEVED!")
        const data = chrome.storage.local.get(['kiln']).then((response => {
        console.log("RESPONSE:", response )
        sendResponse({ status: 'success', data: response})
        return true
        }))


        

        // .then((result) => {
        //     console.log("RESULT:", result)
        //     sendResponse({persistedSnapshot: result.kiln})
        // })
    }

    // return true

    
    // switch (message.action) {
    //     case 'query':
    //         query(message.endpoint, message.params)
    //             .then((data) => {
    //                 sendResponse({ success: true, data });
    //             })
    //             .catch(error => {
    //                 sendResponse({ success: false, error: error.message });
    //             });
    //         // Return true to indicate an asynchronous response
    //         return true;
    //     case 'mutate':
    //         mutate(message.endpoint, message.data)
    //             .then((data) => {
    //                 sendResponse({ success: true, data });
    //             })
    //             .catch(error => {
    //                 sendResponse({ success: false, error: error.message });
    //             });
    //         // Return true to indicate an asynchronous response
    //         return true;
    //     case 'stream':
    //         stream(message.endpoint, message.data, message.promptType, message.streamName)
    //         .then((data) => {
    //                 sendResponse({ success: true, data });
    //             })
    //         .catch(error => {
    //             sendResponse({ success: false, error: error.message });
    //         });
    //         break;
    //     case 'run':
    //         break;
    //     default:
    //         console.error(`Invalid action sent from ${sender}`);
    // }
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

// // Query function
// async function query(endpoint, params = {}) {
//     console.log("Query Executing", endpoint);
//     try {
//         // Build query string for GET parameters
//         const queryString = new URLSearchParams(params).toString();
//         const response = await fetch(`${baseURL}/${endpoint}?${queryString}`, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         await storeObjectInChromeStorage(data);

//         return data;
//     } catch (error) {
//         console.error('Error during query:', error);
//         throw error;
//     }
// }

// // Mutate function
// async function mutate(endpoint, data = {}) {
//     try {
//         const response = await fetch(`${baseURL}/${endpoint}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const responseData = await response.json();
//         await storeObjectInChromeStorage(responseData);

//         return responseData;
//     } catch (error) {
//         console.error('Error during mutation:', error);
//         throw error;
//     }
// }

// async function stream(endpoint, data = {}, promptType, streamName){
//     console.log("STARTING STREAM")
//     try{
//         let url = `${import.meta.env.VITE_REACT_APP_API_DOMAIN}/stream-ai`

//         const options = {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 model: 'gpt-4',
//                 data: data,
//                 promptType: promptType
//             }),
//         }

//         const response = await fetch(url, options);

//         const readStreamOuter = async (response) => {
//             let contentType = response.headers.get('content-type')

//             if(contentType !== 'text/event-stream'){
//                 console.error('Response is not a stream:', contentType)
//                 return {}
//             }  

//             const reader = response.body.getReader();
//             var streamData = ""
            
//             const readStream = async () => {
//                 try {
//                     const { done, value } = await reader.read();
            
//                     const chunk = new TextDecoder().decode(value);
    
//                     const eventLines = chunk.toString()
//                     .split("\n")
//                     .filter((line) => line.trim() !== "")
//                     .map((line) => {
//                             if (line.startsWith('data: ')) return null
//                             return line.split('event: ').join('')
//                     })
//                     .filter(Boolean);
    
//                     if (eventLines[0] === 'close') {
//                         // When no more data, exit the function
//                         return;
//                     }
//                     // Decode the stream data and append it to state
    
//                     const lines = chunk.toString()
//                     .split("\n")
//                     .filter((line) => line.trim() !== "")
//                     .map((line) => {
//                             if (!line.startsWith('data: ')) return null
//                             return line.split('data: ').join('')
//                     })
//                     .filter(Boolean);
                    
//                         lines.forEach((line) => {
//                             chrome.storage.local.get(`${streamName}`, (result) => {
//                                 streamData = streamData + line
//                                 console.log("UPDATED DATA", streamData)
//                                 let storageData = {}
//                                 storageData[streamName] = streamData
//                                 chrome.storage.local.set(storageData);
//                             });
//                         })
                        
//                     // Read the next chunk of data
//                     readStream();

    
//                 } catch (e) {
//                     console.error('Error reading the stream:', e);
//                 }
//             };

//             readStream();
//         }

//         readStreamOuter(response)


//         return 
//     }
//     catch(e){
//         console.error("Stream AI Response Error:", e)
//     }  
// }
// // Stream function
// // async function stream(endpoint, data = {}, promptType, streamName) {
// //     try {
// //         const url = `${baseURL}/${endpoint}`;
// //         const options = {
// //             method: "POST",
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({
// //                 model: 'gpt-4',
// //                 data: data,
// //                 promptType: promptType
// //             }),
// //         };

// //         const response = await fetch(url, options);

// //         if (!response.ok) {
// //             throw new Error(`HTTP error! Status: ${response.status}`);
// //         }

// //         const reader = response.body.getReader();

// //         const readStream = async () => {
// //             try {
// //                 const { done, value } = await reader.read();
// //                 if (done) {
// //                     return;
// //                 }

// //                 const chunk = new TextDecoder().decode(value);
// //                 const lines = chunk.toString().split("\n").filter((line) => line.trim() !== "");

// //                 lines.forEach((line) => {
// //                     if (line.startsWith('data: ')) {
// //                         const data = line.split('data: ').join('');
// //                         // Update Chrome's local storage with the new data
// //                         chrome.storage.local.get(streamName, (result) => {
// //                             const currentData = result.streamResult;
// //                             const updatedData = currentData ? currentData + data : data;
// //                             chrome.storage.local.set({ streamName : updatedData });
// //                         });
// //                     }
// //                 });

// //                 // Read the next chunk of data
// //                 await readStream();
// //             } catch (e) {
// //                 console.error('Error reading the stream:', e);
// //             }
// //         };

// //         await readStream();
// //     } catch (error) {
// //         console.error('Error during streaming:', error);
// //         throw error;
// //     }
// // }

// // async function stream(endpoint, data = {}, promptType){
// //     try{

// //         const options = {
// //             method: "POST",
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //             body: JSON.stringify({
// //                 model: 'gpt-4',
// //                 data: data,
// //                 promptType: promptType
// //             }),
// //         }

// //         const response = await fetch(`${baseURL}/${endpoint}`, options);

// //         const readStreamOuter = async (response) => {
// //             let contentType = response.headers.get('content-type')

// //             if(contentType !== 'text/event-stream'){
// //                 console.error('Response is not a stream:', contentType)
// //                 return {}
// //             }  

// //             const reader = response.body.getReader();
            
// //             const readStream = async () => {
// //                 try {
// //                     const { done, value } = await reader.read();
            
// //                     const chunk = new TextDecoder().decode(value);
    
// //                     const eventLines = chunk.toString()
// //                     .split("\n")
// //                     .filter((line) => line.trim() !== "")
// //                     .map((line) => {
// //                             if (line.startsWith('data: ')) return null
// //                             return line.split('event: ').join('')
// //                     })
// //                     .filter(Boolean);
    
// //                     if (eventLines[0] === 'close') {
// //                         // When no more data, exit the function
// //                         return;
// //                     }
// //                     // Decode the stream data and append it to state
    
// //                     const lines = chunk.toString()
// //                     .split("\n")
// //                     .filter((line) => line.trim() !== "")
// //                     .map((line) => {
// //                             if (!line.startsWith('data: ')) return null
// //                             return line.split('data: ').join('')
// //                     })
// //                     .filter(Boolean);
                    
// //                         lines.forEach((line) => {
// //                             setterFunction(prevData => prevData + line)
// //                         })
                        
// //                     // Read the next chunk of data
// //                     readStream();
// //                 }
// //                 catch(e){
// //                     console.error("Error during stream: ", e)
// //                 }
// //             }
// //             readStream();
// //         }
// //         readStreamOuter(response);

// //     }
// //     catch(e){
// //         console.error("Error during stream: ", e)
// //     }
// // }