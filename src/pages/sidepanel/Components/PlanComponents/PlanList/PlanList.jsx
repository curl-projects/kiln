import React, { useState, useRef, useEffect } from 'react';
import Task from '../PlanTask/PlanTask.jsx';

const initialTasks = [
  { id: '1', content: 'Sample Task', level: 0, checked: false, parentId: null, order: 0 },
  // Additional initial tasks can be added here
];

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const taskRefs = useRef([]);

  const updateTaskOrder = (tasks) => {
    // Assign an order based on current array index
    return tasks.map((task, index) => ({ ...task, order: index }));
  };
  


  useEffect(() => {
    // Check if the tasks array is empty and add a new task if it is
    if (tasks.length === 0) {
      setTasks([
        { id: '1', content: '', level: 0, checked: false, parentId: null, order: 0 }
      ])
    }
  }, [tasks]);  // Dependency on tasks to trigger whenever it changes

  const handleAddTask = (currentId) => {
    const index = tasks.findIndex(task => task.id === currentId);
    const newTask = {
      id: `id-${Date.now()}`,
      content: '',
      level: tasks[index].level,
      checked: false,
      parentId: tasks[index].parentId
    };
    let newTasks = [...tasks.slice(0, index + 1), newTask, ...tasks.slice(index + 1)];
    newTasks = updateTaskOrder(newTasks);
    setTasks(newTasks);
    setTimeout(() => {
      taskRefs.current[index + 1]?.focus();
    }, 0);
  };

  // const handleDeleteTask = (currentId) => {
  //   const index = tasks.findIndex(task => task.id === currentId);
  //   const updatedTasks = tasks.filter(task => task.id !== currentId);
  //   setTasks(updatedTasks);
  //   setTimeout(() => {
  //     if (index > 0) {
  //       taskRefs.current[index - 1]?.focus();
  //     } else if (updatedTasks.length > 0) {
  //       taskRefs.current[0]?.focus();
  //     }
  //   }, 0);
  // };

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

  const handleToggleCheck = (currentId) => {
    const updatedTasks = tasks.map(task => task.id === currentId ? { ...task, checked: !task.checked } : task);
    setTasks(updatedTasks);
  };

  return (
    <div>
      {tasks.map((task, index) => (
        <Task
          index={index}
          key={task.id}
          ref={el => taskRefs.current[index] = el}
          task={task}
          onAdd={handleAddTask}
          onDelete={handleDeleteTask}
          onIndent={handleIndentTask}
          onToggleCheck={handleToggleCheck}
        />
      ))}
    </div>
  );
}

export default TaskList;
