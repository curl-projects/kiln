import { useEffect } from 'react';
import { useActiveTab } from "@pages/content/ui/PanelLogic/PanelLogic.jsx";

export default function ControlPanel({ shadowOpen, setShadowOpen }){
    const { activeTabData, pageData, rawPageData } = useActiveTab();

    useEffect(()=>{
        console.log("ACTIVE TAB DATA:", activeTabData)
        console.log("PAGE DATA:", pageData)
    }, [activeTabData])

    return(
        <div 
            className='controlPanelWrapper' 
            style={styles.controlPanelWrapper}>
            <button onClick={() => setShadowOpen(p => !p)}>Toggle Shadow</button>
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