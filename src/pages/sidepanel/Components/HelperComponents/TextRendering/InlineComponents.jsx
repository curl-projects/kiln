import styles from './InlineComponents.module.css'
import { useDatabase } from '../../../Helpers/Providers/DatabaseProvider';
export function InlineGoal({ id }){
    const { databaseData } = useDatabase();
    const [goalState, setGoalState ] = useState(null)
  
    useEffect(()=>{
      if(databaseData && databaseData.goals){
      // Loop through each goal
        for (const goal of databaseData.goals) {
            if (goal.id === parseInt(id)) {
                setGoalState(goal)
                break;
          }
        }
      }
      else{
        console.error("Goal data not defined")
      }
  
    }, [id])
  
      return(
          <div className={styles.inlineWrapper}>
              {goalState.title}
          </div>
      )
  }

export function InlineTask({ id }){
    // fetch data from task ID
    const databaseData = useGoals();
    const [taskState, setTaskState ] = useState(null)
  
    useEffect(()=>{
      if(databaseData && databaseData.goals){
      // Loop through each goal
        for (const goal of databaseData.goals) {
            // Loop through each task in the current goal
            for (let task of goal.tasks) {
                if (task.id === parseInt(id)) {
                    setTaskState(task)
                    break;
                }
            }
        }
      }
      else{
        console.error("Goal data not defined")
      }
  
    }, [id])
  
  
      return(
          <div className={styles.inlineWrapper}>
            <div className={styles.completedRow}>
              <div className={styles.taskCompleteCircle} />
              <p className={styles.taskEyebrow}>{taskState ? (taskState.completed ? "Complete" : "Incomplete") : "Incomplete"}</p>
            </div>
            <div className={styles.taskTitleWrapper}>
              <p className={styles.taskTitle}>{taskState ? taskState.title : "Unknown title"}</p>
            </div>
          </div>
      )
  }

  export function InlineLink({ id }){
    const databaseData = useGoals();
    const [linkState, setLinkState ] = useState(null)
  
    useEffect(()=>{
      if(databaseData && databaseData.goals){
      // Loop through each goal
        for (const goal of databaseData.goals) {
          // Loop through each task in the current goal
          for (const task of goal.tasks) {
              // Loop through each link in the current task
              for (const link of task.links) {
                  if (link.id === id) {
                      setLinkState(link)
                      break;
                  }
              }
          }
        }
      }
      else{
        console.log("Goal data not defined")
      }
  
    }, [id])
  
      return(
          <div className={styles.inlineWrapper}>
              {linkState.url}
          </div>
      )
  }