import { createContext, useContext, useEffect, useState } from 'react';
import cheerio from 'cheerio';

// Create the context object
export const ActiveTabContext = createContext(null);

// Create a provider component
export default function ActiveTabProvider({ children }) {
  // State for active tab data
  const [activeTabData, setActiveTabData] = useState({
    tabID: null,
    tabTitle: '',
    tabURL: '',
    windowID: null,
  });

  // State for page data
  const [pageData, setPageData] = useState([]);
  const [rawPageData, setRawPageData] = useState('');

  const updateTabData = () => {
    const tabTitle = document.title;
    const tabURL = window.location.href;

    setActiveTabData({
      tabID: null, // Content scripts don't have access to tab ID
      tabTitle,
      tabURL,
      windowID: null, // Content scripts don't have access to window ID
    });

    setPageData([{ text: 'Loading' }]);

    const rawHTML = document.documentElement.innerHTML;
    setRawPageData(rawHTML);

    const $ = cheerio.load(rawHTML);
    const textEls = [];
    $('p, h1, h2, h3').each(function () {
      textEls.push({ tag: this.tagName, text: $(this).text().trim() });
    });
    setPageData(textEls);
  };

  useEffect(() => {
    updateTabData();

    // Listen for URL changes
    const handlePopState = () => {
      updateTabData();
    };
    window.addEventListener('popstate', handlePopState);

    // Listen for page reloads
    const handleDOMContentLoaded = () => {
      updateTabData();
    };
    window.addEventListener('DOMContentLoaded', handleDOMContentLoaded);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('DOMContentLoaded', handleDOMContentLoaded);
    };
  }, []);

  // Provide the data via context
  return (
    <ActiveTabContext.Provider value={{ activeTabData, pageData, rawPageData }}>
      {children}
    </ActiveTabContext.Provider>
  );
}
