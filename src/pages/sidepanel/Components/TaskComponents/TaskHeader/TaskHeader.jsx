import styles from "./TaskHeader.module.css"
import TaskButton from "../TaskButton/TaskButton.jsx"

export default function TaskHeader(){
    return(
    <div className={styles.taskHeaderWrapper}>
        <div className={styles.taskHeaderEyebrowWrapper}>
            <p className={styles.taskHeaderEyebrow}>Active Task</p>
        </div>
        <div className={styles.taskTitleWrapper}>
            <div className={styles.taskTitleCheckbox}/>
            <p className={styles.taskTitle}></p>
        </div>
        <div className={styles.taskTitleUnderline}/>
        <div className={styles.taskButtonRow}>
            {['ai', 'log', 'notes'].map((type) => 
                <TaskButton type={type} active={false} />
            )}
        </div>
    </div>        
    )
}