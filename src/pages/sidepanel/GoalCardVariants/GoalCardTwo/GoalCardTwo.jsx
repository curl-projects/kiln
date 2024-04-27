import styles from "./GoalCardTwo.module.css";
import { FaRegClock } from "react-icons/fa6";

export default function GoalCardTwo(){
    return(
    <div className={styles.goalBox}>
        <div className={styles.goalBadgeWrapper}>
            <div className={styles.goalBadgeInnerCircle} />
            <div className={styles.goalBadgeOuterCircle} />
        </div>
        <div className={styles.goalTitleWrapper}>
            <div className={styles.goalTitleEyebrowWrapper}>
            <p className={styles.goalTitleEyebrow}>Eyebrow</p>
            <div className={styles.goalTitleEyebrowLine}/>
            </div>
            <div className={styles.goalInnerTitleWrapper}>
            <p className={styles.goalTitle}>Be Less Distracted Online</p>
            <div className={styles.goalTitleLine}/>
            </div>
        </div>
        </div>
    )
}