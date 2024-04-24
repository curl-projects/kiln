import refreshOnUpdate from 'virtual:reload-on-update-in-view';

refreshOnUpdate('pages/content/injected/test');

async function sayHi() {
  // get page content
  console.log('CONTENT HI', document.documentElement.outerHTML);

  const response = await chrome.runtime.sendMessage({
    message: document.documentElement.outerHTML,
    messageType: 'sidePanel',
  });

  // send to side panel
}

void sayHi();
