import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import * as cheerio from "cheerio";

refreshOnUpdate('pages/content/injected/pageContent');

(function pageContent(){
  console.log("HI!")
  const $ = cheerio.load(document.documentElement.innerHTML);
  var textEls = []
      const $textEls = $('p, h1, h2, h3').each(function(i, el){
        textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
      })
    textEls;
  
    chrome.runtime.sendMessage({
      messageDestination: 'sidePanel',
      chromeMessageType: 'websiteContent',
      pageData: textEls,
    })
})()


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("REQUEST!", request)
//   if(request.messageDestination === 'pageContent' && request.chromeMessageType === 'getWebsiteContent') {
//     const $ = cheerio.load(document.documentElement.innerHTML);

//     const textEls = []
//     const $textEls = $('p, h1, h2, h3').each(function(i, el){
//       textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
//     })

//     sendResponse({
//       messageDestination: 'sidePanel',
//       chromeMessageType: 'websiteContent',
//       pageData: textEls,
//     })

//     return true;

//     // var content = new Readability(document, {debug: true}).parse();
//     // console.log("Content:", content)
//   }
// })


// // async function sayHi() {
//   // get page content
//   const $ = cheerio.load(document.documentElement.innerHTML);

//   const textEls = []
//   const $textEls = $('p, h1, h2, h3').each(function(i, el){
//     console.log("HI", $(this))
//     textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
//   })

//   console.log("TEXT ELS", textEls)

//   const response = await chrome.runtime.sendMessage({
//     messageDestination: 'sidePanel',
//     messageType: 'websiteContent',
//     pageData: textEls,

//   });

// }

// void sayHi();