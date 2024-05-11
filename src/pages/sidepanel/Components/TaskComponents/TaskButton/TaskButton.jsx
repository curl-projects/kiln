import styles from "./TaskButton.module.css"

export default function TaskButton({type, active, ...props}){
    return(
        <div className={styles.taskButton}>
            {
                {
                    'ai': <p></p>,
                    'log': <p></p>,
                    'notes': <p></p>,
                }[type]
            }
        </div>
    )
}