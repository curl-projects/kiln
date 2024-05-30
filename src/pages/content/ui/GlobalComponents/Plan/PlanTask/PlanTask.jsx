import React, { useState, useEffect } from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Style objects
const styles = {
  taskOuterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    transition: 'all 0.5s ease-in-out',
  },
  taskWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  taskIndexWrapper: {
    width: '50px',
    flexGrow: 0,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
  },
  taskIndexButton: {
    height: '6px',
    width: '6px',
    borderRadius: '100%',
    border: '1px solid #CCCFCC',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    flexShrink: 0,
  },
  taskIndex: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#7F847D',
    fontSize: '14px',
    letterSpacing: '-0.03em',
    zIndex: 10000,
    cursor: 'grab',
  },
  taskInnerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCompleteBox: {
    border: '2px solid #7F847D',
    borderRadius: '4px',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    height: '10px',
    width: '10px',
  },
  taskInput: {
    padding: '8px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    letterSpacing: '-0.02em',
    fontWeight: 500,
    fontFamily: '"IBM Plex Mono", monospace',
    background: 'unset',
  },
  taskCompleteBoxHover: {
    transform: 'scale(1.03)',
  },
  taskIndexButtonHover: {
    backgroundColor: 'rgba(204, 207, 204, 0.5)',
    transform: 'scale(1.05)',
  },
};

const Task = React.forwardRef(({
  task,
  onAdd,
  onDelete,
  onIndent,
  onToggleCheck,
  taskLabel,
  onToggleCollapse,
  handleContentChange,
  isFocusedTask,
  setFocusedTask
}, ref) => {
  const [content, setContent] = useState(task.content);

  useEffect(() => {
    if (handleContentChange) {
      handleContentChange(task.id, content);
    }
  }, [content]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const indentStyles = () => {
    let indent = [];
    for (let i = 0; i < task.level; i++) {
      indent.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${6 + i * 20}px`,
            width: '2px',
            backgroundColor: '#CCC',
          }}
        />
      );
    }
    return indent;
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

  const dynamicStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={dynamicStyle}>
      <div style={styles.taskOuterWrapper} id={task.id}>
        <div style={styles.taskIndexWrapper}>
          <div
            style={{
              ...styles.taskIndexButton,
              backgroundColor: task.collapsed ? 'unset' : '#CCCFCC',
              borderColor: isFocusedTask ? '#FEAD82' : '#CCCFCC',
            }}
            onClick={() => onToggleCollapse(task.id)}
          />
          <span
            {...attributes}
            {...listeners}
            style={{
              ...styles.taskIndex,
              textDecoration: task.checked ? 'line-through' : 'none',
              color: isFocusedTask ? '#FEAD82' : '#7F847D',
            }}
          >
            {task.checked ? 'C' : taskLabel}
          </span>
        </div>
        <div style={{ ...styles.taskWrapper, paddingLeft: `${task.level * 20}px` }}>
          {indentStyles()}
          <div style={styles.taskInnerWrapper}>
            <div
              style={{
                ...styles.taskCompleteBox,
                backgroundColor: task.checked ? '#7F847D' : 'unset',
                borderColor: isFocusedTask ? '#FEAD82' : '#7F847D',
              }}
              onClick={() => onToggleCheck(task.id)}
            />
            <input
              ref={ref}
              type="text"
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocusedTask(task)}
              onBlur={() => setFocusedTask(null)}
              style={{
                ...styles.taskInput,
                textDecoration: task.checked ? 'line-through' : 'none',
                flex: 1,
                color: isFocusedTask ? '#FEAD82' : '#7F847D',
              }}
              placeholder="Type your task here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Task;
