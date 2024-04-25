import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import * as cheerio from "cheerio";

refreshOnUpdate('pages/content/injected/test');



async function sayHi() {
  // get page content
  const $ = cheerio.load(document.documentElement.innerHTML);

  const textEls = []
  const $textEls = $('p, h1, h2, h3').each(function(i, el){
    console.log("HI", $(this))
    textEls.push({tag: $(this).get(0).tagName, text: $(this).text().trim()})
  })

  console.log("TEXT ELS", textEls)

  const response = await chrome.runtime.sendMessage({
    messageDestination: 'sidePanel',
    messageType: 'websiteContent',
    pageData: textEls,

  });

}

void sayHi();
