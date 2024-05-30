import styles from './AIText.module.css';
import { useState, useEffect } from 'react';
import { useStreamAI } from '../../../Hooks/streamAI';
import { renderText } from '../../../Helpers/ProcessingFuncs/renderText.jsx';
import Firefly from '../Firefly/Firefly';

export default function AIText({aiData, promptType}){
    const [aiState, setAIState] = useState("Welcome");
    const AIMutation = useStreamAI();

    useEffect(() => {
        setAIState("");
        AIMutation.mutate({ setterFunction: setAIState,
          data: { ...aiData},
          promptType: promptType || 'sayHello'
        });
      }, []);
    

    return(
        <div className={styles.AIWrapper}>
            <div className={styles.AIIconWrapper}>
                <Firefly />
            </div>
            <div className={styles.AITextWrapper}>
                <p className={styles.AIText}>
                    {renderText(aiState)}
                </p>
            </div>
        </div>
    )
}