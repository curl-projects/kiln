import styles from './Link.module.css'
import AutosaveText from '../AutosaveText/AutosaveText';
import { updateLink } from '../../api-funcs/links';
import { useState } from 'react';

export default function Link({link, index, task, ...props}){
    const [childFunction, setChildFunction] = useState(null);
    return(
        <div className={styles.taskLinkWrapper} key={index}>
            <a className={styles.taskLinkTitle} href={link.url} target="_blank">{link.title}</a>
            <p className={styles.linkAIAction}
            onClick={() => {
                            if(childFunction){
                                childFunction()
                            }
                        }}>Generate Description</p>
            <AutosaveText 
                className={styles.taskLinkDescription}
                content={link.description}
                mutationFn={updateLink}
                objectId={link.id}
                field="description"
                updateType="link"
                promptType="linkDescription"

                aiEnabled={true}

                setChildFunction={setChildFunction}
                goalId={props.goalId}
                taskId={task.id}

                aiData = {{
                    linkTitle: link.title,
                    taskTitle: task.title,
                }}

            />
        </div>
    )
}