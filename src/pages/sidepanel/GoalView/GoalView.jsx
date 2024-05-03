
import styles from "./GoalView.module.css";
import Task from "../Task/Task.jsx";
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from "../../api-funcs/tasks";
import { useEffect, useState } from "react";
import ContentEditable from 'react-contenteditable';
import MainTextChat from "../MainTextChat/MainTextChat";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Timer from "../Timer/Timer";
import { TimerProvider } from "../TimerProvider/TimerProvider";

// import { FloatingDiv } from "../FloatingComponents/FloatingDiv"; 

function GoalView(props){
    const [tasksList, setTasksList] = useState([])


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

    useEffect(() => {
        setTasksList(props.goal.tasks)
    }, [props.goal])


    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;
        if (!destination) {
            return;
        }
        if (destination.index === source.index) {
            return;
        }
        const newTasksList = Array.from(tasksList);
        const [reorderedItem] = newTasksList.splice(source.index, 1);
        newTasksList.splice(destination.index, 0, reorderedItem);

        // Set the new tasks list to the state
        setTasksList(newTasksList);

    };

    return(
        <TimerProvider>
        <div className={styles.goalViewWrapper}>
            <div className={styles.panelTopAccentWrapper}>
                <div className={styles.accentTopEyebrowWrapper}>
                    <p className={styles.accentEyebrow}>{props.goal.title}</p>
                    <div style={{flex: 1}}/>
                    <Timer />
                </div>
                <div className={styles.accentLine}/>
                <p className={styles.accentSecondaryEyebrow} onClick={() => props.setActiveGoal(null)}>BACK</p>
            </div>
            <MainTextChat 
                aiData = {{
                    activeGoal: props.goal,
                    goals: props.goals,
                }}
            />
            <div className={styles.tasksWrapper}>
                <div className={styles.goalActionBar}>
                    <p className={styles.goalActionBarHeader}>Tasks</p>
                    <div style={{flex: 1}}/>
                    {/* <p className={styles.goalAction}>Collapse Cards</p>
                    <div className={styles.goalActionSeparator}/> */}
                    <p className={styles.goalAction} onClick={() => {
                        taskMutation.mutate({ goalId: props.goal.id})
                    }}>Add New Task</p>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="tasks">
                    {(provided) => (
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className={styles.tasksWrapper}
                        >
                            {tasksList.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Task 
                                                index={index}
                                                task={task}
                                                activeTabData={props.activeTabData}
                                                goal={props.goal}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </DragDropContext>
                <div className={styles.goalActionBar}>
                    <p className={styles.goalActionBarHeader}>Suggested Tasks</p>
                    <div style={{flex: 1}}/>
                    {/* <p className={styles.goalAction}>Collapse Cards</p>
                    <div className={styles.goalActionSeparator}/> */}
                    {/* <p className={styles.goalAction} onClick={() => {
                        taskMutation.mutate({ goalId: props.goal.id})
                    }}>Add New Task</p> */}
                </div>
                <div style={{height: "400px", width: "400px", border: "2px solid black"}}>
                    {/* <FloatingDiv config={{ mass: 20, tension: 170, friction: 26 }}>
                        I'm floating!
                    </FloatingDiv>
                    <FloatingDiv config={{ mass: 20, tension: 170, friction: 26 }}>
                        I'm floating!
                    </FloatingDiv> */}
                </div>
                {/* <Task suggested={true}/> */}
            </div>
        </div>
        </TimerProvider>
    )
}

export default withErrorBoundary(withSuspense(GoalView, 
    <div> Loading ... </div>), 
    <div> 
        An error has occurred
    </div>
);