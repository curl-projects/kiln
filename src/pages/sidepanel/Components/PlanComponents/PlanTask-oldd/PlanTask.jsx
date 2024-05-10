import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import styles from "./PlanTask.module.css";

const Task = React.forwardRef(({ task, onAdd, onDelete, onIndent, onToggleCheck, taskLabel, onToggleCollapse, onContentChange }, ref) => {
  const [content, setContent] = useState(task.content);

  // Generate styles for indentation lines
  const indentStyles = () => {
    let styles = [];
    for (let i = 0; i < task.level; i++) {
      styles.push(<div key={i} style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        backgroundColor: "#DFE2DF",
        left: `${6 + i * 20}px`,
        width: '2px',
        backgroundColor: '#CCC'
      }} />);
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

  const handleChange = (e) => {
    onContentChange(task.id, e.target.value);
  };

  return (
    <div className={styles.taskOuterWrapper}>
    <div className={styles.taskIndexWrapper}>
      <div 
        className={styles.taskIndexButton} 
        style={{
          backgroundColor: task.collapsed ? "unset" : "#CCCFCC"
        }}
        onClick={() => onToggleCollapse(task.id)}/>
      <span className={styles.taskIndex} style={{
        textDecoration: task.checked ? 'line-through' : 'none'
      }}>{task.checked ? "C" : taskLabel}</span>
    </div>
    <div className={styles.taskWrapper} style={{paddingLeft: `${task.level * 20}px`}}>
      {indentStyles()}
      <div className={styles.taskInnerWrapper}>
        <div className={styles.taskCompleteBox} onClick={() => onToggleCheck(task.id)} style={{
          backgroundColor: task.checked ? '#7F847D' : 'unset',
          borderColor: task.checked ? '#7F847D' : '#7f847d'
        }}/>
        <input
          ref={ref}
          type="text"
          value={task.content}
          className={styles.taskInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ textDecoration: task.checked ? 'line-through' : 'none', flex: 1 }}
          placeholder="Type your task here..."
        />
      </div>
    </div>
    </div>
  );
});

export default Task;

