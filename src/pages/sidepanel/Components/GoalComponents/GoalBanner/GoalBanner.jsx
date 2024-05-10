import styles from './GoalBanner.module.css'; 
import { IoCaretBack } from 'react-icons/io5';

export default function GoalBanner({ activeGoal, setActiveGoal }){
    return(
       <div className={styles.goalBannerWrapper}>
            <div className={styles.goalTextWrapper}>
                <div className={styles.goalTextInnerWrapper} onClick={()=>setActiveGoal(null)}>
                    <p className={styles.goalBackButton}><IoCaretBack /></p>
                    <p className={styles.goalTitle}>{activeGoal?.title || "No Title"}</p>
                </div>
                <div className={styles.goalUnderline}/>
            </div>
            <div style={{flex: 1}}/>
            <div className={styles.buttonRow}>
                <div className={styles.button}>
                    <p className={styles.buttonText}>Show Completed</p>
                </div>
                <div className={styles.button}>
                    <p className={styles.buttonText}>Focus</p>
                </div>
            </div>
       </div> 
    )
}