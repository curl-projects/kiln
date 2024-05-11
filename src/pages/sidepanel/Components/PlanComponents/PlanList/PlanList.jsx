import styles from "./PlanList.module.css"
import React, { useState, useRef, useEffect } from 'react';
import Task from '../PlanTask/PlanTask.jsx';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const [draggedItem, setDraggedItem] = useState(null);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleContentChange = (taskId, newContent) => {
    // Create a new tasks list with the updated content for the specific task
    const updatedTasks = tasks.map((task) => 
      task.id === taskId ? { ...task, content: newContent } : task
    );
    setTasks(updatedTasks);
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
  // Capture the active task and its children when starting to drag
  const onDragStart = (event) => {
    const { active } = event;
    const { id: activeId } = active;
    const activeIndex = tasks.findIndex((task) => task.id === activeId);
    const draggedTask = tasks[activeIndex];
    const childTasks = [];

    // Find children of the dragged task
    for (let i = activeIndex + 1; i < tasks.length; i++) {
      if (tasks[i].level <= draggedTask.level) break;
      childTasks.push(tasks[i]);
    }

    setDraggedItem({ task: draggedTask, children: childTasks });
  };

  // Handle dropping of tasks and updating their new positions
  const onDragEnd = (event) => {
    console.log("OVER", event.over, event.active)

    if(!event.over){
      setDraggedItem(null);
      return;
    };
    const { active, over } = event;
    const { id: activeId } = active;
    const { id: overId } = over;

    if (activeId !== overId) {
      const oldIndex = tasks.findIndex((task) => task.id === activeId);
      const newIndex = tasks.findIndex((task) => task.id === overId);

      // Remove the dragged task and its children from the original position
      const newTasks = [...tasks];
      newTasks.splice(oldIndex, 1 + draggedItem.children.length);

      // Insert the dragged task and its children at the new position
      const newEffectiveIndex = newIndex > oldIndex ? newIndex - draggedItem.children.length : newIndex;
      newTasks.splice(newEffectiveIndex, 0, draggedItem.task, ...draggedItem.children);

      // Update the task order
      const updatedTasks = updateTaskOrder(newTasks);
      setTasks(updatedTasks);
    }

    setDraggedItem(null); // Reset the dragged item after dropping
  };

  // Render tasks in the main list, excluding those currently being dragged
  const renderTasks = () => {
    const taskStack = [];
    return tasks.map((task, index) => {
      // Adjust the task stack for managing hierarchical levels
      while (taskStack.length > 0 && taskStack[taskStack.length - 1].level >= task.level) {
        taskStack.pop();
      }

      const isCollapsed = taskStack.some(t => t.collapsed);

      // Skip rendering if the task or any of its parents are collapsed
      if (taskStack.length === 0 || !isCollapsed) {
        taskStack.push(task);

        // Skip rendering if the task is currently being dragged
        if (draggedItem && (task.id === draggedItem.task.id || draggedItem.children.some(child => child.id === task.id))) {
          return null;
        }

        return (
          <Task
            key={task.id}
            task={task}
            ref={el => taskRefs.current[index] = el}
            taskLabel={calculateTaskIndex(tasks, task.id)}
            onAdd={() => handleAddTask(task.id)}
            onDelete={() => handleDeleteTask(task.id)}
            onIndent={handleIndentTask}
            onToggleCheck={() => handleToggleCheck(task.id)}
            onToggleCollapse={handleToggleCollapse}
            handleContentChange={handleContentChange}
          />
        );
      }

      return null;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.taskContainer}>
          {renderTasks()}
        </div>
      </SortableContext>
      <DragOverlay>
        {draggedItem && (
          <div>
            <Task task={draggedItem.task} taskLabel={calculateTaskIndex(tasks, draggedItem.task.id)} />
            {draggedItem.children.map((child) => (
              <Task key={child.id} task={child} taskLabel={calculateTaskIndex(tasks, child.id)} />
            ))}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default TaskList;
