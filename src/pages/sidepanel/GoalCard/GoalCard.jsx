import styles from "./GoalCard.module.css";
import { FaRegClock } from "react-icons/fa6";

export default function GoalCard(props){
    return(
    <div className={styles.goalBox} onClick={() => props.isActive ? props.setActiveGoal(null) : props.setActiveGoal(props.goal)}> 
        <div className={styles.goalBadgeWrapper}>
            <div 
                className={styles.goalBadgeInnerCircle}
                style={{backgroundColor: props.isActive ? 'rgba(254, 172, 133, 0.5)' : '#EFF1EF'}}
            />
            <div 
                className={styles.goalBadgeOuterCircle}
                style={{backgroundColor: props.isActive ? 'rgba(254, 172, 133, 0.5)' : 'rgba(255, 255, 255, 0.5)'}}
            
            />
        </div>
        <div className={styles.goalTitleWrapper}>
            <div className={styles.goalTitleEyebrowWrapper}>
            <p className={styles.goalTitleEyebrow}>{props.goal.category}</p>
            <div className={styles.goalTitleEyebrowLine}/>
            </div>
            <div className={styles.goalInnerTitleWrapper}>
            <p className={styles.goalTitle}>{props.goal.title}</p>
            <div className={styles.goalTitleLine}/>
            </div>
        </div>
        </div>
    )
}



// {props.goalRanking 
//     ? 
//     <div className={styles.relevanceBox} style={{
//         backgroundColor: {
//             'High': "#F97032",
//             "Medium": "#FEAD82",
//             "Low": "#FDECE3",
//         }[props.goalRanking],
//         borderColor: {
//             'High': "#9F3A0C",
//             "Medium": "#D2652C",
//             "Low": "#E2BFAD",
//         }[props.goalRanking],
//     }}>
//         <p className={styles.relevanceNumber} style={{ color: "7F847D" }}>
//             {/* {{'High': "Relevant",
//             "Medium": "Somewhat Relevant",
//             "Low": "Not Relevant",
//             }[props.goalRanking]} */}
//             {{'High': "",
//             "Medium": "",
//             "Low": "",
//             }[props.goalRanking]}
            
//             </p>
//     </div>
//     :
//     <div className={styles.relevanceBox}>
//         <p className={styles.relevanceNumber}>...</p>
//     </div>
// }