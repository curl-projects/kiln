import styles from './Task.module.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState, useEffect } from 'react';
import AutosaveText from '../AutosaveText/AutosaveText';
import { updateTask } from '../../api-funcs/tasks';
import { createLink } from '../../api-funcs/links';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from '../Link/Link';
import { FiX } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { deleteTask } from '../../api-funcs/tasks';

export default function Task({ task, suggested, ...props }){
    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const [linksOpen, setLinksOpen] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [triggerAI, setTriggerAI] = useState(false);
    const queryClient = useQueryClient()

    const linksMutation = useMutation({
        mutationFn: createLink,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['goals']})
        },
        onError: (data) => {
            console.error("MUTATION ERROR:", data)
        }
    })

    useEffect(() => {
        linksMutation.reset()
    }, [])


    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['goals']})
        },
        onError: (data) => {
            console.error("MUTATION ERROR:", data)
        }
    })

    // useEffect(()=>{
    //     console.log("STATUS:", deleteTaskMutation.status)
    // }, [deleteTaskMutation.status])


    if(deleteTaskMutation.status === 'pending' || deleteTaskMutation.status === 'success'){
        return(<></>)
    }

    return(
        <div className={styles.taskOuterWrapper}>
            {!suggested &&
            // <p className={styles.taskHandle}>
            //     <RxDragHandleDots2 />
            // </p>
            <>
            <div className={styles.taskCircle}>
                <p className={styles.taskIndexNumber}>{props.index+1}</p>
            </div>
            <div className={styles.taskLinkingLine} />
            </>
            
            }
            <div className={styles.taskInnerWrapper}>
                <div className={styles.taskEyebrowWrapper} onClick={()=>setTaskCompleted(prevState => !prevState)}>
                    {suggested ? 
                    <>
                        <p className={styles.taskEyebrow}>Suggested</p>
                    </>
                    :
                    <>
                        <div className={styles.taskCompleteCircle} style={{
                            backgroundColor: taskCompleted ? "#FEAC85" : "unset"
                        }}/>
                        <p className={styles.taskEyebrow}>{taskCompleted ? "Completed" : "Incomplete"}</p>
                        <div style={{flex: 1}}/>
                        <p className={styles.deleteButton} onClick={() => {
                            deleteTaskMutation.mutate({
                                taskId: task.id
                            })
                        }}><FiX/></p>
                    </>
                    }
                </div>
                <div className={styles.taskTitleWrapper}>
                {suggested ?
                    <p className={styles.taskTitle}>Title</p>
                    :
                    <AutosaveText
                        className={styles.taskTitle} 
                        content={task.title}
                        mutationFn={updateTask}
                        updateType="task"
                        promptType="taskTitle"
                        objectId={task.id}
                        field="title"
                        goalId={props.goal.id}
                        />
                } 
                </div>
                {!suggested &&
                    <div className={styles.taskDetailsOuterWrapper}>
                    <TaskDetail 
                        task={task}
                        goal={props.goal}
                        detailType="Description"
                        activeTabData={props.activeTabData}
                        extraProps={{

                        }}
                    />
                        <TaskDetail 
                            task={task}
                            goal={props.goal}
                            detailType="Links"
                            activeTabData={props.activeTabData}
                            extraProps={{
                                linksMutation: linksMutation
                            }}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export function TaskDetail({ task, goal, detailType, activeTabData, extraProps}){
    const [detailOpen, setDetailOpen] = useState(false);
    const [childFunction, setChildFunction] = useState(null);

    return(
        <div className={styles.taskDetailWrapper}>
        <div className={styles.taskDetailTitleWrapper}>
            <div className={styles.circleTaskDetailTitleWrapper} style={{
                backgroundColor: detailOpen ? "#CCCFCC" : "unset"
            }} onClick={()=>setDetailOpen(p => !p)}/>
            <p className={styles.taskDetailTitle} onClick={()=>setDetailOpen(p => !p)}>{detailType}</p>
            <div style={{flex: 1}}/>

            {detailType === 'Description' &&
                <p 
                    className={styles.taskDetailAction} 
                    onClick={() => {
                            if(childFunction){
                                childFunction()
                            }
                        }}     
                    style={{ color: "#CCCFCC" }}>
                        {task.description ? "Re-Generate" : "Auto-Generate"}
                </p>    
            }
            {detailType === 'Links' &&
                <p 
                    className={styles.taskDetailAction} 
                    onClick={() => {
                        extraProps.linksMutation?.mutate({
                            linkTitle: activeTabData.tabTitle,
                            linkURL: activeTabData.tabURL,
                            taskId: task.id,
                            })
                    }} 
                    style={{ color: "#CCCFCC"}}>
                    {detailType === "Links" &&
                        {
                            'idle': "Add Current Page",
                            'pending': "Adding Current Page",
                            'success': "Added Current Page",
                            'error': "Error Adding Page"
                        }[extraProps.linksMutation.status]
                    }
                </p>    
            }
        </div>
        <div className={styles.detailAccentLine}/>
        {detailOpen && detailType === 'Description' &&
            <div className={styles.taskDescriptionWrapper}>
                <AutosaveText 
                    className={styles.taskDescription} 
                    content={task.description}
                    mutationFn={updateTask}
                    updateType="task"
                    promptType="taskDescription"
                    objectId={task.id}
                    field="description"
                    setChildFunction={setChildFunction}
                    goalId={goal.id}

                    aiEnabled={true}

                    aiData={{
                        task: task.title,
                        goalTitle: goal.title,
                        goalDescription: goal.description
                    }}
                    />
            </div>
        }
        {detailOpen && detailType === 'Links' &&
            <div className={styles.tasksLinksOuterWrapper}>
            {(task.links && task.links.length !== 0) ? 
                task.links.map((link, index) => (
                    <Link 
                        link={link} 
                        index={index}
                        task={task}
                        goalId={goal.id}
                        />
                ))
            :  <div className={styles.taskLinkWrapper}>
                    <p className={styles.taskLinkTitle}>No links</p>
                </div>
            }
        </div>
        }
        </div>
    )
}