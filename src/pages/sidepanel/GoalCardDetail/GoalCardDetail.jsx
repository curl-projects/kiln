import styles from "./GoalCardDetail.module.css";
import { FaRegClock } from "react-icons/fa6";

export default function GoalCardDetail(props){
    return(
        <div className={styles.goalsDetailWrapper}>
            <div className={styles.goalDescriptionWrapper}>
                <p className={styles.goalDescription}>
                    {props.activeGoal.description}
                </p>
                <div className={styles.goalDescriptionLine}/>
            </div>
            <div className={styles.goalMetadataOuterWrapper}>
                <div className={styles.goalMetadataInnerWrapper}>
                    <div className={styles.goalMetadataLabelWrapper}>
                    <p className={styles.goalMetadataLabelIcon}><FaRegClock /></p>
                    <p className={styles.goalMetadataLabel}>Time</p>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className={styles.goalMetadataNumberBox}>
                    <p className={styles.goalMetadataNumber}>12H</p>
                    </div>
                </div>
                <div className={styles.goalMetadataLine}/>
            </div>
        </div>
    )
}