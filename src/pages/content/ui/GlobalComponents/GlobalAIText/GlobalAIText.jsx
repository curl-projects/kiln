import { useEffect, useContext } from "react";
import { BasePanelContext } from '@pages/content/ui/PanelLogic/PanelLogic.jsx'

export default function GlobalAIText({ streamName }){
    const streamOptions = {
        endpoint: '/stream-ai', 
        data: {}, 
        promptType: 'sayHello', 
        streamName: streamName
    }
    const { stream, data } = useContext(BasePanelContext);

    useEffect(()=>{
        stream(streamOptions)
    }, [])

    useEffect(()=>{
        console.log("DATA:", data)
    }, [data])

    return(

        <div>
            <p>{(data && data[streamName]) ? data[streamName] : "Nothing"}</p>
        </div>
    )
}