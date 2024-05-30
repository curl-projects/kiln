
const styles = {
    taskButton: {

    }
}

export default function TaskButton({type, active, ...props}){
    return(
        <div className='taskButton' style={styles.taskButton}>
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

