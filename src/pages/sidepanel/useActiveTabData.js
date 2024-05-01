import { useEffect, useState } from 'react';
import cheerio from 'cheerio';

function useActiveTabDataUpdater() {
    // State for active tab data
    const [activeTabData, setActiveTabData] = useState({
        tabID: null,
        tabTitle: '',
        tabURL: '',
        windowId: null
    });

    // State for page data
    const [pageData, setPageData] = useState([]);

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

    return { activeTabData, pageData };
}

export default useActiveTabDataUpdater;
