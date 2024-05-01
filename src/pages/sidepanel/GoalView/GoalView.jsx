
import styles from "./GoalView.module.css";
import Task from "../Task/Task.jsx";
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from "../../api-funcs/tasks";
import { useEffect } from "react";


function GoalView(props){
    const queryClient = useQueryClient()

    const taskMutation = useMutation({
        mutationFn: createTask,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['goals']})
            },
            onError: (data) => {
                console.log("MUTATION ERROR:", data)
            }
        }
    )

    useEffect(() => {
        console.log("VIEW GOAL:", props.goal)
    }, [props.goal])

    return(
        <div className={styles.goalViewWrapper}>
            <div className={styles.panelTopAccentWrapper}>
                <div className={styles.accentTopEyebrowWrapper}>
                    <p className={styles.accentEyebrow}>{props.goal.title}</p>
                    <div style={{flex: 1}}/>
                </div>
                <div className={styles.accentLine}/>
                <p className={styles.accentSecondaryEyebrow} onClick={() => props.setActiveGoal(null)}>BACK</p>
            </div>
            <div className={styles.mainTextWrapper}>
                <h1 className={styles.mainText}>Welcome</h1>
                <div className={styles.mainTextLine}/>
            </div>
            <div className={styles.tasksWrapper}>
                <div className={styles.goalActionBar}>
                    <div style={{flex: 1}}/>
                    <p className={styles.goalAction}>Collapse Cards</p>
                    <div className={styles.goalActionSeparator}/>
                    <p className={styles.goalAction} onClick={() => {
                        taskMutation.mutate({ goalId: props.goal.id})
                    }}>Add New Task</p>
                </div>
                {props.goal.tasks && props.goal.tasks.map((task, index) => 
                    <Task 
                        task={task}
                        key={index}
                        activeTabData={props.activeTabData}
                        goal={props.goal}
                    />
                )
                }
                
            </div>
        </div>
    )
}

export default withErrorBoundary(withSuspense(GoalView, 
    <div> Loading ... </div>), 
    <div> 
        An error has occurred
    </div>
);