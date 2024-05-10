import React, { useState } from 'react';
import styles from "./PlanTask.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Task = React.forwardRef(({
  task,
  onAdd,
  onDelete,
  onIndent,
  onToggleCheck,
  taskLabel,
  onToggleCollapse
}, ref) => {
  
  const [content, setContent] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const indentStyles = () => {
    let styles = [];
    for (let i = 0; i < task.level; i++) {
      styles.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${6 + i * 20}px`,
            width: '2px',
            backgroundColor: '#CCC'
          }}
        />
      );
    }
    return styles;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd(task.id);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onIndent(task.id, !e.shiftKey);
    } else if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      onDelete(task.id);
    }
  };

  const handleChange = (e) => setContent(e.target.value);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div className={styles.taskOuterWrapper} id={task.id}>
        <div className={styles.taskIndexWrapper} {...attributes} {...listeners}>
          <div
            className={styles.taskIndexButton}
            style={{
              backgroundColor: task.collapsed ? 'unset' : '#CCCFCC'
            }}
            onClick={() => onToggleCollapse(task.id)}
          />
          <span
            className={styles.taskIndex}
            style={{
              textDecoration: task.checked ? 'line-through' : 'none'
            }}
          >
            {task.checked ? 'C' : taskLabel}
          </span>
        </div>
        <div
          className={styles.taskWrapper}
          style={{ paddingLeft: `${task.level * 20}px` }}
        >
          {indentStyles()}
          <div className={styles.taskInnerWrapper}>
            <div
              className={styles.taskCompleteBox}
              onClick={() => onToggleCheck(task.id)}
              style={{
                backgroundColor: task.checked ? '#7F847D' : 'unset',
                borderColor: task.checked ? '#7F847D' : '#7F847D'
              }}
            />
            <input
              ref={ref}
              type='text'
              value={content}
              className={styles.taskInput}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{
                textDecoration: task.checked ? 'line-through' : 'none',
                flex: 1
              }}
              placeholder='Type your task here...'
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Task;