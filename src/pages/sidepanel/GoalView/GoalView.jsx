
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
        <div className={styles.goalViewWrapper}>
            <div className={styles.panelTopAccentWrapper}>
                <div className={styles.accentTopEyebrowWrapper}>
                    <p className={styles.accentEyebrow}>{props.goal.title}</p>
                    <div style={{flex: 1}}/>
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
                    <div style={{flex: 1}}/>
                    <p className={styles.goalAction}>Collapse Cards</p>
                    <div className={styles.goalActionSeparator}/>
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