import { useEffect, useState } from 'react';
import { useGoals } from '../GoalDataProvider/GoalDataProvider';
import styles from './InlineComponents.module.css';

function InlineGoal({ id }){
  const goalData = useGoals();
  const [goalState, setGoalState ] = useState(null)

  useEffect(()=>{
    if(goalData && goalData.goals){
    // Loop through each goal
      for (const goal of goalData.goals) {
          if (goal.id === parseInt(id)) {
              setGoalState(goal)
              break;
        }
      }
    }
    else{
      console.log("Goal data not defined")
    }

  }, [id])

    return(
        <div className={styles.inlineWrapper}>
            {goalState.title}
        </div>
    )
}

function InlineTask({ id }){
  // fetch data from task ID
  const goalData = useGoals();
  const [taskState, setTaskState ] = useState(null)

  console.log("TASK ID::", id)

  console.log("GOAL DATA:", goalData)

  useEffect(()=>{
    if(goalData && goalData.goals){
    // Loop through each goal
      for (const goal of goalData.goals) {
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

function InlineLink({ id }){
  const goalData = useGoals();
  const [linkState, setLinkState ] = useState(null)

  useEffect(()=>{
    if(goalData && goalData.goals){
    // Loop through each goal
      for (const goal of goalData.goals) {
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

export const parseAndRenderText = (rawText, dataContext) => {
    const componentRegex = /\{\{([^}]+)\}\}/g;
    let output = [];
    let lastIndex = 0;

    // Regular expression to detect list items and ensure newline before them

    const inputText = rawText.replace(/\d+\.\s?/g, (match) => {
      console.log("MATCH:", match)
      return '\n' + match});

  
    inputText.replace(componentRegex, (match, paramsString, index) => {
      // Add the previous literal text wrapped in a <span>
      let textSegment = inputText.substring(lastIndex, index);

      output.push(<span key={'text-' + lastIndex}>{textSegment}</span>);

      console.log("PARAM STRING:", paramsString)

      // Parse type and other parameters
      const params = paramsString.split(',').reduce((acc, param) => {
        const [key, value] = param.trim().split(':');
        acc[key.trim()] = value.trim();
        return acc;
      }, {});

      const { type, ...otherParams } = params; // Destructure the type from other parameters

      // Check the type and render the appropriate component
      switch (type) {
        case 'goal':
          output.push(<InlineGoal key={'component-' + index} dataContext={dataContext} {...otherParams} />);
          break;
        case 'task':
          output.push(<InlineTask key={'component-' + index} dataContext={dataContext} {...otherParams} />);
          break;
        case 'link':
          output.push(<InlineLink key={'component-' + index} dataContext={dataContext} {...otherParams} />);
          break;
        default:
          console.error("Unsupported type:", type);
          output.push(<span key={'error-' + index}>[[Unsupported component type]]</span>);
          break;
      }
  
      lastIndex = index + match.length;
      return match; // This return is not used, required for replace function
    });
  
    // Add any remaining text after the last match wrapped in a <span>
    if (lastIndex < inputText.length) {
      output.push(<span key={'text-' + lastIndex}>{inputText.substring(lastIndex)}</span>);
    }
  
    return output;
};
