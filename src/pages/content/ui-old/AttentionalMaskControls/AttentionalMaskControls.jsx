import { useEffect, useState } from 'react';


export default function AttentionalMaskControls({type, name, fn, syncState, ...props}){
    const [isActive, setIsActive] = useState(false)

    function matchesInjectedDomains(domainArray, injectedDomains) {
        const domain = domainArray[0];
        const pathSegments = domainArray.slice(1);
      
        if (injectedDomains[domain]) {
          return injectedDomains[domain].pages.some(
            page => page.length === pathSegments.length && page.every((segment, index) => segment === pathSegments[index]),
          );
        }
        return false;
      }
    
    useEffect(() => {
        console.log("SYNC STATE:", syncState)
        if(syncState.domain && syncState.injectedDomains){
            console.log("MATCHES:", matchesInjectedDomains(syncState.domain && syncState.injectedDomains))
        }
    }, [syncState]);

    return(
        <div className={"contentScriptFuncWrapper"}>
            <div className={"funcDescriptionWrapper"}>
                <p className={"funcDescription"}>{name}
                {(syncState.domain && syncState.injectedDomains) && matchesInjectedDomains(syncState.domain, syncState.injectedDomains) && <span style={{color: "#FEAC85"}}>ACTIVE</span>}
                </p>
            </div>
            <div 
                className={"funcControlWrapper"}
                style={{
                    background: isActive ? "#FEAC85" : "white"
                }} 
                onClick={()=>{
                    setIsActive(!isActive)
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs
                          .sendMessage(tabs[0].id, { action: injectedDomains[domain[0]].actionKeyword })
                          .then(response => {
                            console.log('TAB RESPONSE:', response);
                          });
                      });
                }}>
                <p className={"funcControl"} style={{
                    color: isActive ? "white" : "#b9bcb8"
                }}>
                    {isActive ? "ON" : "OFF"}
                </p>
            </div>
        </div>
    )
}