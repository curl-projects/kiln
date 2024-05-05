import { useEffect } from 'react';

let injectedDomains = {
    'youtube.com': {
        pages: [['watch'], ['play', 'game']],
        actionKeyword: "focus"
    },
    'linkedin.com': {
        pages: [['feed']],
        actionKeyword: "focus"
    }
}

export function useInjectContentScript(url, tabID) {
   
    useEffect(() => {
        if (!url || !tabID) return;

        let domain = extractDomainAndPathSegments(url);
        chrome.scripting.executeScript({
            target: { tabId: tabID },
            function: handleDomainScript,
            args: [domain]
        }, (results) => {
            if (results && results[0]) {
                console.log('Execution with observer results:', results[0].result);
            } else {
                console.log('Error or no results');
            } 
        });

    }, [url, tabID]); // Dependency array includes URL and tab ID

    return {
        injectedDomains: injectedDomains,
        domain: extractDomainAndPathSegments(url)
    }
}

function handleDomainScript(domain){
    let isActive = false;

    function makeScriptMutationAware(injectedScript){
        let isActive = false;

        // Listener for messages from the sidepanel
        chrome.runtime.onMessage.addListener(function(request) {
            injectedScript(request);
        });
        
        function handleMutations(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    console.log('Detected DOM change, updating blur effect.');
                    // injectedScript({ action: 'mutationDetected'}, isActive);  // Re-apply script logic to adjust for new DOM changes
                    break;
                }
            }
        }
    
        injectedScript({ action: "initialize" })
    
        // re-application of blur on mutation
        const observer = new MutationObserver(handleMutations);
        const config = { attributes: true, childList: true, subtree: true };
        observer.observe(document.body, config);
    
        window.addEventListener('unload', () => {
            observer.disconnect()
            injectedScript({ action: "cleanup"})
        });
    }

    // SPECIFIC SCRIPTS
    function linkedinFeedScript(request){
        
        function toggleActive(activeState) {
            console.log("ACTIVE STATE::", activeState)
            const elements = [
                document.getElementsByClassName('scaffold-layout')[0], 
                ...document.getElementsByClassName('app-aware-link')
            ];
            console.log("ELEMENTS:", elements)
            elements.forEach(elem => {
                if (elem) {
                    elem.style.filter = activeState ? 'blur(20px)' : 'none';
                }
            });
        }

        function cleanupEffects(){
            const elements = [
                document.getElementsByClassName('scaffold-layout')[0],
                document.getElementsByClassName('app-aware-link')[0]
            ];
            elements.forEach(elem => {
                if (elem) {
                    elem.style.filter = 'none'; // Remove any styles
                }
            });

        };

        switch (request.action) {
            case 'focus':
                console.log("FOCUSING")
                console.log("OUTER BLUR BEFORE:", isActive)
                isActive = !isActive;
                console.log("OUTER BLUR:", isActive)
                toggleActive(isActive);
                console.log("BLUR TOGGLED")
                break;
            case 'initialize':
                toggleActive(isActive);
                break;
            case 'mutationDetected':
                // toggleBlur(isBlurred);  // Optionally re-apply blur based on mutations
                break;
            case 'cleanup':
                cleanupEffects();
                break;
            default:
                console.log('Unhandled request:', request);
                break;
        }
    }

    function youtubeWatchScript(request){

        function toggleActive(activeState) {
            console.log("ACTIVE STATE::", activeState)
            const elements = [document.getElementById('below'), document.getElementById('secondary')];
            console.log("ELEMENTS:", elements)
            elements.forEach(elem => {
                if (elem) {
                    elem.style.filter = activeState ? 'blur(20px)' : 'none';
                }
            });
        }

        function cleanupEffects(){
            const elements = [document.getElementById('below'), document.getElementById('secondary')];
            elements.forEach(elem => {
                if (elem) {
                    elem.style.filter = 'none'; // Remove any styles
                }
            });

        };



        switch (request.action) {
            case 'focus':
                console.log("FOCUSING")
                console.log("OUTER BLUR BEFORE:", isActive)
                isActive = !isActive;
                console.log("OUTER BLUR:", isActive)
                toggleActive(isActive);
                console.log("BLUR TOGGLED")
                break;
            case 'initialize':
                toggleActive(isActive);
                break;
            case 'mutationDetected':
                // toggleBlur(isBlurred);  // Optionally re-apply blur based on mutations
                break;
            case 'cleanup':
                cleanupEffects();
                break;
            default:
                console.log('Unhandled request:', request);
                break;
        }
    };

    switch(domain[0]){
        // HANDLE SUBDOMAINS
        case 'youtube.com':
            if(domain[1] === 'watch'){
                makeScriptMutationAware(youtubeWatchScript)
            }
            break;
        case 'linkedin.com':
            if(domain[1] === 'feed'){
                makeScriptMutationAware(linkedinFeedScript)
            }
        default: // don't inject any content script by default
            
    }
  }

function extractDomainAndPathSegments(url) {
    try {
        // Create a new URL object from the input URL string
        const parsedUrl = new URL(url);

        // Extract the hostname from the URL
        let domain = parsedUrl.hostname;

        // Remove 'www.' if it exists to normalize the domain name
        domain = domain.replace(/^www\./, '');

        // Get the pathname and split it by '/' to isolate parts
        const pathSegments = parsedUrl.pathname.split('/').filter(segment => segment.length > 0);

        // Return the domain followed by all path segments as an array
        return [domain, ...pathSegments];
    } catch (error) {
        // If an error occurs (e.g., invalid URL), log the error and return a message
        console.error("Failed to parse the URL:", error);
        return ["Invalid URL"];
    }
}
