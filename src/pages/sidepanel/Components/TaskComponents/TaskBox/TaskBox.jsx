import styles from "./TaskBox.module.css"

import TaskHeader from "../TaskHeader/TaskHeader.jsx"
export default function TaskBox(){
    return(
        <div className={styles.taskBoxOuterWrapper}>
            <div className={styles.taskBoxInnerWrapper}>
                <TaskHeader /> 
            </div>
        </div>
    )
}