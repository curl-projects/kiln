import styles from './ContentScriptControls.module.css'

function matchesInjectedDomains(domainArray, injectedDomains) {
    const domain = domainArray[0];
    const pathSegments = domainArray.slice(1);

    if (injectedDomains[domain]) {
        return injectedDomains[domain].pages.some(page =>
            page.length === pathSegments.length && page.every((segment, index) => segment === pathSegments[index])
        );
    }
    return false;

}

export default function ContentScriptControls({domain, injectedDomains, ...props}){
    console.log("DOMAIN:", domain)
    return(
        <div className={styles.controlsWrapper}>
            <p>DOMAIN: {domain.join("/")}</p>
            {matchesInjectedDomains(domain, injectedDomains)
            ? <>
            <p>Content script for current domain</p>
            <button 
                onClick={()=>{
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        console.log("TAB:", tabs[0].id)
                        console.log("ACTION KEYWORD:", injectedDomains[domain[0]].actionKeyword)
                        chrome.tabs.sendMessage(tabs[0].id, {action: injectedDomains[domain[0]].actionKeyword})
                        .then(response => {
                            console.log("TAB RESPONSE:", response)
                        })
                    });
                }}>
                    Activate content script
            </button>
            </>
            : <p>No content script for current domain</p>
            }
        </div>
    )
    }