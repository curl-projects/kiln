import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import 'webextension-polyfill';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

console.log('background loaded');

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(error => console.error(error));

// // EXTERNAL MESSAGE LISTENER
// chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
//   if(request.jwt){
//     console.log("Token ::: ", request.jwt)
//     sendResponse({ success: true, message: 'Token has been Received.' })
//   }
// });