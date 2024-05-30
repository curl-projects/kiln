import { useEffect } from 'react';
import { useActiveTab } from "@pages/content/ui/PanelLogic/PanelLogic.jsx";
import { useFish } from "@pages/content/ui/ScriptHelpers/FishOrchestrationProvider/FishOrchestrationProvider.jsx";

export default function ControlPanel({ shadowOpen, setShadowOpen }){
    const { activeTabData, pageData, rawPageData } = useActiveTab();
    const { fishOrchestrator } = useFish();

    useEffect(()=>{
        console.log("ACTIVE TAB DATA:", activeTabData)
        console.log("PAGE DATA:", pageData)
    }, [activeTabData])

    return(
        <div 
            className='controlPanelWrapper' 
            style={styles.controlPanelWrapper}>
            <button onClick={() => setShadowOpen(p => !p)}>Toggle Shadow</button>
            <button onClick={() => setShadowOpen(p => !p)}>Say Hello</button>
            <button onClick={() => {
                console.log("Emitting")
                fishOrchestrator.emit('moveFish')
                console.log("Emitted")
                }}>Move Fish to Random Location</button>
            <button onClick={() => setShadowOpen(p => !p)}>Regenerate Fish</button>
        </div>
    )
}

const styles = {
    controlPanelWrapper: {
        height: '200px',
        width: '200px',
        overflow: "hidden",
    }

}