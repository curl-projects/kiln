import styles from './Task.module.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState, useEffect } from 'react';
import AutosaveText from '../AutosaveText/AutosaveText';
import { updateTask } from '../../api-funcs/tasks';
import { createLink } from '../../api-funcs/links';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from '../Link/Link';


export default function Task({ task, ...props }){
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


    useEffect(()=>{
        console.log("NEW TASK DATA:", task)
    }, [task])

    return(
        <div className={styles.taskOuterWrapper}>
            <div className={styles.taskInnerWrapper}>
                <div className={styles.taskEyebrowWrapper} onClick={()=>setTaskCompleted(prevState => !prevState)}>
                    <div className={styles.taskCompleteCircle} style={{
                        backgroundColor: task.completed ? "#FEAC85" : "unset"
                    }}/>
                    <p className={styles.taskEyebrow}>{task.completed ? "Completed" : "Incomplete"}</p>
                </div>
                <div className={styles.taskTitleWrapper}>
                <AutosaveText 
                    className={styles.taskTitle} 
                    content={task.title}
                    mutationFn={updateTask}
                    objectId={task.id}
                    field="title"
                    goalId={props.goal.id}
                    />
                </div>
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
            </div>
        </div>
    )
}

// // links action function
// const actionFn = (activeTabData, task) => {
//     linksMutation.mutate({
//         linkTitle: activeTabData.tabTitle,
//         linkURL: activeTabData.tabURL,
//         taskId: task.id,
//         })
// }

// // description action function
// const handleButtonClick = () => {
//     if(childFunction){
//         childFunction()
//     }
// }

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
                    objectId={task.id}
                    field="description"
                    setChildFunction={setChildFunction}

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
                    <Link link={link} index={index}/>
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


// import styles from './Task.module.css';
// import { RiArrowDropDownLine } from "react-icons/ri";
// import { useState, useEffect } from 'react';
// import AutosaveText from '../AutosaveText/AutosaveText';
// import { updateTask } from '../../api-funcs/tasks';
// import { createLink } from '../../api-funcs/links';
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import Link from '../Link/Link';


// export default function Task({ task, ...props }){
//     const [descriptionOpen, setDescriptionOpen] = useState(false);
//     const [linksOpen, setLinksOpen] = useState(false);
//     const [taskCompleted, setTaskCompleted] = useState(false);
//     const [triggerAI, setTriggerAI] = useState(false);
//     const queryClient = useQueryClient()

//     const linksMutation = useMutation({
//         mutationFn: createLink,
//         onSuccess: () => {
//             queryClient.invalidateQueries({queryKey: ['goals']})
//         },
//         onError: (data) => {
//             console.error("MUTATION ERROR:", data)
//         }
//     })

//     useEffect(() => {
//         linksMutation.reset()
//     }, [])


//     useEffect(()=>{
//         console.log("NEW TASK DATA:", task)
//     }, [task])

//     return(
//         <div className={styles.taskOuterWrapper}>
//             <div className={styles.taskInnerWrapper}>
//                 <div className={styles.taskEyebrowWrapper} onClick={()=>setTaskCompleted(prevState => !prevState)}>
//                     <div className={styles.taskCompleteCircle} style={{
//                         backgroundColor: task.completed ? "#FEAC85" : "unset"
//                     }}/>
//                     <p className={styles.taskEyebrow}>{task.completed ? "Completed" : "Incomplete"}</p>
//                 </div>
//                 <div className={styles.taskTitleWrapper}>
//                     <AutosaveText 
//                         className={styles.taskTitle} 
//                         content={task.title}
//                         mutationFn={updateTask}
//                         objectId={task.id}
//                         field="title"
//                         goalId={props.goal.id}
//                         />
//                 </div>
//                 <div className={styles.taskDetailsOuterWrapper}>
//                     <div className={styles.taskDetailWrapper}>
//                     <div className={styles.taskDetailTitleWrapper}>
//                         <div className={styles.circleTaskDetailTitleWrapper} style={{
//                             backgroundColor: descriptionOpen ? "#CCCFCC" : "unset"
//                         }} onClick={()=>setDescriptionOpen(prevState => !prevState)}/>
//                         <p className={styles.taskDetailTitle} onClick={()=>setDescriptionOpen(prevState => !prevState)}>Description</p>
//                         <div style={{flex: 1}}/>
//                         <p className={styles.taskDetailAction} onClick={()=>{setTriggerAI(true)}} style={{
//                             color: task.description ? "#CCCFCC" : "#FEAC85"
                        
//                         }}>
//                             {task.description ? "Re-Generate" : "Auto-Generate"}
//                         </p>
//                     </div>
//                     <div className={styles.detailAccentLine}/>
//                     {descriptionOpen &&
//                         <div className={styles.taskDescriptionWrapper}>
//                             <AutosaveText 
//                                 className={styles.taskDescription} 
//                                 content={task.description}
//                                 mutationFn={updateTask}
//                                 objectId={task.id}
//                                 field="description"

//                                 aiEnabled={true}
//                                 triggerAI={triggerAI}
//                                 setTriggerAI={setTriggerAI}
//                                 aiData={{
//                                     task: task.title,
//                                     goalTitle: props.goal.title,
//                                     goalDescription: props.goal.description
//                                 }}
//                                 />
//                         </div>
//                     }
//                     </div>
//                     <div className={styles.taskDetailWrapper}>
//                     <div className={styles.taskDetailTitleWrapper}>
//                         <div className={styles.circleTaskDetailTitleWrapper} style={{
//                             backgroundColor: linksOpen ? "#CCCFCC" : "unset"
//                         }} onClick={()=>setLinksOpen(prevState => !prevState)}/>
//                         <p className={styles.taskDetailTitle} onClick={()=>setLinksOpen(prevState => !prevState)}>Links</p>
//                         <div style={{flex: 1}}/>
//                         <p 
//                             className={styles.taskDetailAction} 
//                             onClick={() => linksMutation.mutate({
//                                 linkTitle: props.activeTabData.tabTitle,
//                                 linkURL: props.activeTabData.tabURL,
//                                 taskId: task.id,
//                                 })}>
//                                 {linksMutation.status === 'pending' && "Adding Current Page"}
//                                 {linksMutation.status === 'success' && "Added Current Page"}
//                                 {linksMutation.status === 'error' && "Error Adding Page"}
//                                 {linksMutation.status === 'idle' && "Add Current Page"}
//                                 </p>
//                     </div>
//                     <div className={styles.detailAccentLine}/>
//                     {linksOpen &&
//                         <div className={styles.tasksLinksOuterWrapper}>
//                             {(task.links && task.links.length !== 0) ? 
//                                 task.links.map((link, index) => (
//                                     <Link link={link} index={index}/>
//                                 ))
//                             :  <div className={styles.taskLinkWrapper}>
//                                     <p className={styles.taskLinkTitle}>No links</p>
//                                 </div>
//                             }
//                         </div>
//                     }
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
