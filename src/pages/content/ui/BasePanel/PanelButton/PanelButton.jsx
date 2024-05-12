import { RiFocusFill } from 'react-icons/ri'
import { GrTask } from "react-icons/gr";
import { PiMapTrifoldBold } from "react-icons/pi";

export default function PanelButton({type, setCollapsed}){
    return(
        <div style={styles.panelButtonWrapper} onClick={() => setCollapsed(prevState => !prevState)}>

                {{
                        'localAI': <RiFocusFill />,
                        'globalAI': <PiMapTrifoldBold />,
                        'planList': <GrTask />,
                    }[type]
                }
        </div>
    )
}

const styles = {
    panelButtonWrapper: {
        height: '30px',
        width: '30px',
        border: "3px solid #7F847D",
        display: 'flex',
        alignItems: 'center',
        fontSize: '24px',
        color: "#7F847D",
        justifyContent: 'center',
        borderRadius: '100%',
    },
}