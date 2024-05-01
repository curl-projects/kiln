import styles from './Task.module.css';
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState, useEffect } from 'react';
import AutosaveText from '../AutosaveText/AutosaveText';
import { updateTask } from '../../api-funcs/tasks';
import { createLink } from '../../api-funcs/links';
import { useMutation, useQueryClient } from '@tanstack/react-query'


export default function Task({ task, ...props }){
    const [descriptionOpen, setDescriptionOpen] = useState(true);
    const [linksOpen, setLinksOpen] = useState(true);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const queryClient = useQueryClient()

    useEffect(()=>{
        console.log("TASK:", task)
    }, [task])

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

    useEffect(() => {
        console.log("LINKS MUTATION:", linksMutation.status, linksMutation.isLoading)
    }, [linksMutation.isLoading, linksMutation.isSuccess, linksMutation.isError, linksMutation.isIdle])

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
                        />
                </div>
                <div className={styles.taskDetailsOuterWrapper}>
                    <div className={styles.taskDetailWrapper}>
                    <div className={styles.taskDetailTitleWrapper}>
                        <div className={styles.circleTaskDetailTitleWrapper} style={{
                            backgroundColor: descriptionOpen ? "#FEAC85" : "unset"
                        }} onClick={()=>setDescriptionOpen(prevState => !prevState)}/>
                        <p className={styles.taskDetailTitle} onClick={()=>setDescriptionOpen(prevState => !prevState)}>Description & Justification</p>
                    </div>
                    <div className={styles.detailAccentLine}/>
                    {descriptionOpen &&
                        <div className={styles.taskDescriptionWrapper}>
                            <AutosaveText 
                                className={styles.taskDescription} 
                                content={task.description}
                                mutationFn={updateTask}
                                objectId={task.id}
                                field="description"
                                />
                        </div>
                    }
                    </div>
                    <div className={styles.taskDetailWrapper}>
                    <div className={styles.taskDetailTitleWrapper}>
                        <div className={styles.circleTaskDetailTitleWrapper} style={{
                            backgroundColor: linksOpen ? "#FEAC85" : "unset"
                        }} onClick={()=>setLinksOpen(prevState => !prevState)}/>
                        <p className={styles.taskDetailTitle} onClick={()=>setLinksOpen(prevState => !prevState)}>Links</p>
                        <div style={{flex: 1}}/>
                        <p 
                            className={styles.taskDetailAction} 
                            onClick={() => linksMutation.mutate({
                                linkTitle: props.activeTabData.tabTitle,
                                linkURL: props.activeTabData.tabURL,
                                taskId: task.id,
                                })}>
                                {linksMutation.status === 'pending' && "Adding Current Page"}
                                {linksMutation.status === 'success' && "Added Current Page"}
                                {linksMutation.status === 'error' && "Error Adding Page"}
                                {linksMutation.status === 'idle' && "Add Current Page"}
                                </p>
                    </div>
                    <div className={styles.detailAccentLine}/>
                    {linksOpen &&
                        <div className={styles.tasksLinksOuterWrapper}>
                            {(task.links && task.links.length !== 0) ? 
                                task.links.map((link, index) => (
                                <div className={styles.taskLinkWrapper} key={index}>
                                    <a className={styles.taskLinkTitle} href={link.url} target="_blank">{link.title}</a>
                                    <p className={styles.taskLinkDescription} contentEditable>{link.description}</p>
                                </div>
                                ))
                            :  <div className={styles.taskLinkWrapper}>
                                    <p className={styles.taskLinkTitle}>No links</p>
                                </div>
                            }
                        </div>
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}