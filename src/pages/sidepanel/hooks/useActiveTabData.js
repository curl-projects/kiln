import { useEffect, useState } from 'react';
import cheerio from 'cheerio';
import { set } from 'lodash';

// HTML PROCESSING -- EXPERIMENTAL
// function stripTextFromHtml(htmlString) {
//     // Parse the HTML string into a DOM object
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlString, 'text/html');

//     // Function to remove all text nodes from an element
//     function removeTextNodes(element) {
//         for (const node of Array.from(element.childNodes)) {
//             if (node.nodeType === Node.TEXT_NODE) {
//                 // Remove text node
//                 node.remove();
//             } else if (node.nodeType === Node.ELEMENT_NODE) {
//                 // Recursively remove text from child elements
//                 removeTextNodes(node);
//             }
//         }
//     }

//     // Remove text nodes from the body of the parsed document
//     removeTextNodes(doc.body);

//     // Serialize the body back to an HTML string
//     return doc.body.innerHTML;
// }

// function extractClassAndIds(htmlString) {
//     // Create a new DOM parser
//     const parser = new DOMParser();
    
//     // Parse the HTML string into a document
//     const doc = parser.parseFromString(htmlString, 'text/html');
    
//     // Initialize arrays to hold unique class and ID names
//     const classNames = new Set();
//     const idNames = new Set();
    
//     // Get all elements from the document
//     const elements = doc.querySelectorAll('*');
    
//     // Loop through all elements to extract class and ID names
//     for (let element of elements) {
//         // Add ID if it exists and is not an empty string
//         if (element.id) {
//             idNames.add(element.id);
//         }
//         // Add all class names if there are any
//         if (element.className) {
//             let classes = element.className;
//             // Check if className is not a string (e.g., SVGAnimatedString)
//             if (typeof classes !== 'string') {
//                 classes = classes.baseVal; // Assume it's SVGAnimatedString
//             }
//             classes.split(/\s+/).forEach(cls => {
//                 if (cls) {
//                     classNames.add(cls);
//                 }
//             });
//         }
//     }

//     // Convert Set to Array and merge both class and ID arrays
//     return Array.from(classNames).concat(Array.from(idNames));
// }


function useActiveTabDataUpdater() {
    // State for active tab data
    const [activeTabData, setActiveTabData] = useState({
        tabID: null,
        tabTitle: '',
        tabURL: '',
        windowID: null
    });

    // State for page data
    const [pageData, setPageData] = useState([]);
    const [rawPageData, setRawPageData] = useState('');

    useEffect(() => {
        async function updateTabData() {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab) {
                setActiveTabData({
                    tabID: tab.id,
                    tabTitle: tab.title,
                    tabURL: tab.url,
                    windowId: tab.windowId
                });
                setPageData([{ text: "Loading" }]);

                chrome.scripting.executeScript({
                    target: { tabId: tab.id, allFrames: false },
                    func: () => document.documentElement.innerHTML,
                }).then(injectionResults => {
                    setRawPageData(injectionResults[0].result);
                    const { result } = injectionResults[0];
                    const $ = cheerio.load(result);
                    var textEls = [];
                    $('p, h1, h2, h3').each(function () {
                        textEls.push({ tag: this.tagName, text: $(this).text().trim() });
                    });
                    setPageData(textEls);
                });
            };
        }

        updateTabData();

        const onActivated = async (activeInfo) => {
            chrome.tabs.get(activeInfo.tabId, function (tab) {
                setActiveTabData({ tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId });
                setPageData([{ text: "Loading" }]);

                chrome.scripting.executeScript({
                    target: { tabId: activeInfo.tabId, allFrames: false },
                    func: () => document.documentElement.innerHTML,
                }).then(injectionResults => {
                    setRawPageData(injectionResults[0].result);
                    const { result } = injectionResults[0];
                    const $ = cheerio.load(result);
                    var textEls = [];
                    $('p, h1, h2, h3').each(function () {
                        textEls.push({ tag: this.tagName, text: $(this).text().trim() });
                    });
                    setPageData(textEls);
                });
            });
        };

        chrome.tabs.onActivated.addListener(onActivated);

        const onUpdated = (tabId, changeInfo, tab) => {
            if (tab.active && changeInfo.status === 'complete') {
                chrome.tabs.get(tabId, function (tab) {
                    setActiveTabData({ tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowId: tab.windowId });
                    setPageData([{ text: "Loading" }]);

                    chrome.scripting.executeScript({
                        target: { tabId: tabId, allFrames: false },
                        func: () => document.documentElement.innerHTML,
                    }).then(injectionResults => {
                        setRawPageData(injectionResults[0].result);
                        const { result } = injectionResults[0];
                        const $ = cheerio.load(result);
                        var textEls = [];
                        $('p, h1, h2, h3').each(function () {
                            textEls.push({ tag: this.tagName, text: $(this).text().trim() });
                        });
                        setPageData(textEls);
                    });
                });
            }
        };

        chrome.tabs.onUpdated.addListener(onUpdated);

        return () => {
            chrome.tabs.onActivated.removeListener(onActivated);
            chrome.tabs.onUpdated.removeListener(onUpdated);
        };
    }, []);

    // console.debug('PROCESSED PAGE DATA', extractClassAndIds(rawPageData))

    return { activeTabData, pageData, rawPageData };
}

export default useActiveTabDataUpdater;
