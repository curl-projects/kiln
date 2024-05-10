import styles from "./PlanList.module.css"
import React, { useState, useRef, useEffect } from 'react';
import Task from '../PlanTask/PlanTask.jsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = [
  { id: '1', content: 'Sample Task', level: 0, checked: false, parentId: null, order: 0, collapsed: false },
  // Additional initial tasks can be added here
];

function getNumericIndex(index) {
  return `${index + 1}`;
}

function getAlphabeticIndex(index) {
  let result = '';
  while (index >= 0) {
    result = String.fromCharCode(97 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
}

function getRomanIndex(index) {
  index += 1; // Adjust the index for Roman numeral computation
  const numerals = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"],
    [100, "c"], [90, "xc"], [50, "l"], [40, "xl"],
    [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"]
  ];
  let result = '';
  let i = 0;
  while (index > 0) {
    while (index >= numerals[i][0]) {
      index -= numerals[i][0];
      result += numerals[i][1];
    }
    i++;
  }
  return result;
}


function calculateTaskIndex(tasks, taskId) {
  // Find the task in the list
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return "Task not found";

  const task = tasks[taskIndex];
  const level = task.level;
  let parentIndex = -1;

  // Find the parent task index
  for (let i = taskIndex - 1; i >= 0; i--) {
    if (tasks[i].level < level) {
      parentIndex = i;
      break;
    }
  }

  // Recursively get the parent's index if it exists
  let parentPrefix = '';
  if (parentIndex !== -1) {
    parentPrefix = calculateTaskIndex(tasks, tasks[parentIndex].id);
    // parentPrefix += parentPrefix ? "." : "";  // Append period only if there is a parent prefix
  }

  // Count siblings at the same level up to the current task
  let siblingCount = 0;
  for (let i = parentIndex + 1; i < taskIndex; i++) {
    if (tasks[i].level === level) {
      siblingCount++;
    }
  }

  // Determine the formatting style based on the level
  let indexStr;
  switch (level % 3) {
    case 0:
      indexStr = getNumericIndex(siblingCount);
      break;
    case 1:
      indexStr = getAlphabeticIndex(siblingCount);
      break;
    case 2:
      indexStr = getRomanIndex(siblingCount);
      break;
    default:
      indexStr = '';
  }

  return parentPrefix + indexStr;  // Correctly formatted full index without excessive periods
}


function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const taskRefs = useRef([]);

  const updateTaskOrder = (tasks) => {
    // Assign an order based on current array index
    return tasks.map((task, index) => ({ ...task, order: index }));
  };

  

  useEffect(() => {
    console.log("TASKS:", tasks)
    // Check if the tasks array is empty and add a new task if it is
    if (tasks.length === 0) {
      setTasks([
        { id: '1', content: '', level: 0, checked: false, parentId: null, order: 0 }
      ])
    }
  }, [tasks]);  // Dependency on tasks to trigger whenever it changes

  const handleToggleCollapse = (taskId) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, collapsed: !task.collapsed };
      }
      return task;
    });
    setTasks(newTasks);
  };


  const handleAddTask = (currentId) => {
    const index = tasks.findIndex(task => task.id === currentId);
    const newTask = {
      id: `id-${Date.now()}`,
      content: '',
      level: tasks[index].level,
      checked: false,
      parentId: tasks[index].parentId,
      collapsed: false,
    };
    let newTasks = [...tasks.slice(0, index + 1), newTask, ...tasks.slice(index + 1)];
    newTasks = updateTaskOrder(newTasks);
    setTasks(newTasks);
    setTimeout(() => {
      taskRefs.current[index + 1]?.focus();
    }, 0);
  };

  const handleDeleteTask = (currentId) => {
    const index = tasks.findIndex(task => task.id === currentId);
    if (index === -1) return; // Task not found, exit function
    
    const deletedTaskLevel = tasks[index].level;
    let updatedTasks = [...tasks];

    // Adjust levels of subsequent tasks that are considered children
    for (let i = index + 1; i < updatedTasks.length; i++) {
        if (updatedTasks[i].level <= deletedTaskLevel) {
            break; // Stop adjusting if a task of the same or lower level is found
        }
        updatedTasks[i].level -= 1; // Decrease level by one
    }

    // Remove the deleted task
    updatedTasks.splice(index, 1);
    updatedTasks = updateTaskOrder(updatedTasks);
    setTasks(updatedTasks);

    // Manage focus after task deletion
    setTimeout(() => {
        if (updatedTasks.length > 0) {
            const nextFocusIndex = index > 0 ? index - 1 : 0;
            if (taskRefs.current[nextFocusIndex]) {
                taskRefs.current[nextFocusIndex].focus();
            }
        }
    }, 0);
};

  const handleIndentTask = (currentId, increase) => {
    const index = tasks.findIndex(task => task.id === currentId);
    if (increase && index > 0 && tasks[index - 1].level >= tasks[index].level) {
      const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, level: task.level + 1 } : task));
      setTasks(updatedTasks);
    } else if (!increase && tasks[index].level > 0) {
      const updatedTasks = tasks.map((task, i) => (i === index ? { ...task, level: task.level - 1 } : task));
      setTasks(updatedTasks);
    }
  };

  const handleToggleCheck = (taskId) => {
    let newTasks = [...tasks];
    const taskIndex = newTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return; // Task not found, exit function

    // Toggle the checked state of the task
    const isChecked = !newTasks[taskIndex].checked;
    newTasks[taskIndex] = {
        ...newTasks[taskIndex],
        checked: isChecked
    };

    // Recursively check all children
    const checkChildren = (index) => {
        const startLevel = newTasks[index].level;
        for (let i = index + 1; i < newTasks.length && newTasks[i].level > startLevel; i++) {
            if (newTasks[i].level === startLevel + 1) {
                newTasks[i] = { ...newTasks[i], checked: isChecked };
                checkChildren(i); // Recursive call for deeper levels
            }
        }
    };

    // Check all children if the task is being checked
    checkChildren(taskIndex);

    setTasks(newTasks);
};

const onDragEnd = (result) => {
  const { draggableId, destination } = result;

  if (!destination) {
    return;
  }

  const newTasks = Array.from(tasks);
  const draggedTaskIndex = newTasks.findIndex((task) => task.id === draggableId);
  var draggedTask = newTasks[draggedTaskIndex];

  console.log("DRAGGED TASK", draggedTask)

  // Find the children of the dragged task
  const childTasks = [];
  for (let i = draggedTaskIndex + 1; i < newTasks.length; i++) {
    if (newTasks[i].level <= draggedTask.level) {
      break;
    }
    childTasks.push(newTasks[i]);
  }

  // Remove the dragged task and its children from the list
  newTasks.splice(draggedTaskIndex, 1 + childTasks.length);


    
  if (destination.index === 0) {
    draggedTask.level = 0;
    draggedTask.parentId = null;
    
  } else {
    const previousTask = tasks[destination.index];
    draggedTask.level = previousTask.level;
    draggedTask.parentId = previousTask.parentId;
  }

  // Insert the dragged task and its children at the destination index
  newTasks.splice(destination.index, 0, draggedTask, ...childTasks);

  // Update the levels of the dragged task's children
  childTasks.forEach((childTask) => {
    childTask.level = childTask.level - draggedTask.level + draggedTask.level + 1;
  });

  const updatedTasks = updateTaskOrder(newTasks);
  setTasks(updatedTasks);
};

  const renderTasks = () => {
    const taskStack = [];
    return tasks.map((task, index) => {  // Capture the index here
        while (taskStack.length > 0 && taskStack[taskStack.length - 1].level >= task.level) {
            taskStack.pop();
        }

        const isCollapsed = taskStack.some(t => t.collapsed);

        if (taskStack.length === 0 || !isCollapsed) {
            taskStack.push(task);
            return (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task
                        key={task.id}
                        ref={el => taskRefs.current[index] = el}  // Use index for ref setting
                        task={task}
                        taskLabel={calculateTaskIndex(tasks, task.id)}
                        onAdd={() => handleAddTask(task.id)}
                        onDelete={() => handleDeleteTask(task.id)}
                        onIndent={handleIndentTask}
                        onToggleCheck={() => handleToggleCheck(task.id)}
                        onToggleCollapse={handleToggleCollapse}
                    />
                  </div>
                )}
              </Draggable>

            );
        }

        return null;
    });
};



  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div className={styles.taskContainer}>
              {renderTasks()}
            </div>
          {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default TaskList;


// {tasks.map((task, index) => (
  // <Task
  //   key={task.id}
  //   ref={el => taskRefs.current[index] = el}
  //   task={task}
  //   taskLabel={calculateTaskIndex(tasks, task.id)}
  //   onAdd={handleAddTask}
  //   onDelete={handleDeleteTask}
  //   onIndent={handleIndentTask}
  //   onToggleCheck={handleToggleCheck}
  // />
// ))}