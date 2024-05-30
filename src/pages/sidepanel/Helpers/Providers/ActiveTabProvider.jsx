import { createContext, useContext, useEffect, useState } from 'react';
import cheerio from 'cheerio';

// Create the context object
const ActiveTabContext = createContext(null);

// Create a provider component
export default function ActiveTabProvider({ children }) {
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
                    windowID: tab.windowId
                });
                setPageData([{ text: "Loading" }]);

                chrome.scripting.executeScript({
                    target: { tabId: tab.id, allFrames: false },
                    func: () => document.documentElement.innerHTML,
                }).then(injectionResults => {
                    setRawPageData(injectionResults[0].result);
                    const { result } = injectionResults[0];
                    const $ = cheerio.load(result);
                    const textEls = [];
                    $('p, h1, h2, h3').each(function () {
                        textEls.push({ tag: this.tagName, text: $(this).text().trim() });
                    });
                    setPageData(textEls);
                });
            }
        }

        updateTabData();

        const onActivated = async (activeInfo) => {
            chrome.tabs.get(activeInfo.tabId, function (tab) {
                setActiveTabData({ tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowID: tab.windowId });
                setPageData([{ text: "Loading" }]);

                chrome.scripting.executeScript({
                    target: { tabId: activeInfo.tabId, allFrames: false },
                    func: () => document.documentElement.innerHTML,
                }).then(injectionResults => {
                    setRawPageData(injectionResults[0].result);
                    const { result } = injectionResults[0];
                    const $ = cheerio.load(result);
                    const textEls = [];
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
                    setActiveTabData({ tabID: tab.id, tabTitle: tab.title, tabURL: tab.url, windowID: tab.windowId });
                    setPageData([{ text: "Loading" }]);

                    chrome.scripting.executeScript({
                        target: { tabId, allFrames: false },
                        func: () => document.documentElement.innerHTML,
                    }).then(injectionResults => {
                        setRawPageData(injectionResults[0].result);
                        const { result } = injectionResults[0];
                        const $ = cheerio.load(result);
                        const textEls = [];
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

    // Provide the data via context
    return (
        <ActiveTabContext.Provider value={{ activeTabData, pageData, rawPageData }}>
            {children}
        </ActiveTabContext.Provider>
    );
}

// Custom hook to access the context data easily
export function useActiveTab() {
    const context = useContext(ActiveTabContext);
    if (context === null) {
        throw new Error('useActiveTab must be used within an ActiveTabProvider');
    }
    return context;
}
