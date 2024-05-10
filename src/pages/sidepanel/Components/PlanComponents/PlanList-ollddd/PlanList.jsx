import React, { useState, useRef } from 'react';
import styles from './PlanList.module.css';
import Task from '../PlanTask/PlanTask.jsx';
import Nestable from 'react-nestable';

const initialTasks = [
  { id: '1', content: 'Sample Task', level: 0, checked: false, parentId: null, collapsed: false },
  // Additional initial tasks can be added here
];

function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const taskRefs = useRef([]);

  // Convert flat list to a hierarchical structure
  const generateTaskTree = (flatTasks) => {
    const taskMap = new Map(flatTasks.map((task) => [task.id, { ...task, children: [] }]));
    const tree = [];

    flatTasks.forEach((task) => {
      const node = taskMap.get(task.id);
      if (task.parentId) {
        taskMap.get(task.parentId).children.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  // Flatten the nested structure back into a flat list
  const flattenTaskTree = (tree, parentId = null, level = 0) => {
    return tree.reduce((acc, node) => {
      const flatNode = { ...node, parentId, level };
      const children = node.children || [];
      return [...acc, flatNode, ...flattenTaskTree(children, node.id, level + 1)];
    }, []);
  };

  // Handle changes to the nested structure from drag-and-drop
  const handleNestChange = ({ items }) => {
    setTasks(flattenTaskTree(items));
  };

  const handleTaskContentChange = (taskId, newContent) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, content: newContent } : task
      )
    );
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
      children: [],
    };

    let newTasks = [...tasks.slice(0, index + 1), newTask, ...tasks.slice(index + 1)];
    setTasks(newTasks);

    setTimeout(() => {
      taskRefs.current[index + 1]?.focus();
    }, 0);
  };

  const handleDeleteTask = (currentId) => {
    const index = tasks.findIndex(task => task.id === currentId);
    if (index === -1) return;

    const deletedTaskLevel = tasks[index].level;
    let updatedTasks = [...tasks];

    for (let i = index + 1; i < updatedTasks.length; i++) {
      if (updatedTasks[i].level <= deletedTaskLevel) break;
      updatedTasks[i].level -= 1;
    }

    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);

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
    let updatedTasks = [...tasks];
    const index = updatedTasks.findIndex(task => task.id === currentId);

    if (increase && index > 0) {
      const prevTask = updatedTasks[index - 1];
      if (prevTask.level >= updatedTasks[index].level) {
        updatedTasks[index] = { ...updatedTasks[index], level: prevTask.level + 1, parentId: prevTask.id };
      }
    } else if (!increase && updatedTasks[index].level > 0) {
      const task = updatedTasks[index];
      const parentIndex = updatedTasks.findIndex((t) => t.id === task.parentId);
      updatedTasks[index] = { ...task, level: task.level - 1, parentId: parentIndex !== -1 ? updatedTasks[parentIndex].parentId : null };
    }

    setTasks(updatedTasks);
  };

  const renderTask = ({ item, index, handler }) => (
    <Task
      key={item.id}
      ref={el => taskRefs.current[index] = el}
      task={item}
      handler={handler}
      collapseIcon={<span>&#x25BC;</span>}
      onAdd={() => handleAddTask(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
      onIndent={(taskId, increase) => handleIndentTask(taskId, increase)}
      onContentChange={(taskId, newContent) => handleTaskContentChange(taskId, newContent)}
    />
  );

  return (
    <div className={styles.taskContainer}>
      <Nestable
        items={generateTaskTree(tasks)}
        renderItem={renderTask}
        onChange={handleNestChange}
      />
    </div>
  );
}

export default TaskList;
