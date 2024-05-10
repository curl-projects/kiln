import React, { useState, useRef, useEffect } from 'react';
import Task from '../PlanTask/PlanTask.jsx';

const initialTasks = [
  { id: '1', content: 'Sample Task', level: 0, checked: false, parentId: null },
  // Additional initial tasks can be added here
];

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const taskRefs = useRef([]);

  useEffect(() => {
    // Check if the tasks array is empty and add a new task if it is
    if (tasks.length === 0) {
      setTasks([
        { id: '1', content: '', level: 0, checked: false, parentId: null }
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
    const newTasks = [...tasks.slice(0, index + 1), newTask, ...tasks.slice(index + 1)];
    setTasks(newTasks);
    setTimeout(() => {
      taskRefs.current[index + 1]?.focus();
    }, 0);
  };

  const handleDeleteTask = (currentId) => {
    const index = tasks.findIndex(task => task.id === currentId);
    const updatedTasks = tasks.filter(task => task.id !== currentId);
    setTasks(updatedTasks);
    setTimeout(() => {
      if (index > 0) {
        taskRefs.current[index - 1]?.focus();
      } else if (updatedTasks.length > 0) {
        taskRefs.current[0]?.focus();
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
