import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import React, {
  forwardRef, useEffect, useImperativeHandle,
  useState,
} from 'react'

import { default as MentionExtension } from "@tiptap/extension-mention";
import { ReactNodeViewRenderer, mergeAttributes } from "@tiptap/react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

export const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = index => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className='items' style={styles.items}>
      {props.items.length
        ? props.items.map((item, index) => (
          <button
            style={{ ...styles.item, ...(index === selectedIndex && styles.selectedItem) }}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item}
          </button>
        ))
        : <div className={styles.item}>No result</div>
      }
    </div>
  )
})

export default {
  items: ({ query }) => {
    return [
      'Lea Thompson',
      'Cyndi Lauper',
      'Tom Cruise',
      'Madonna',
      'Jerry Hall',
      'Joan Collins',
      'Winona Ryder',
      'Christina Applegate',
      'Alyssa Milano',
      'Molly Ringwald',
      'Ally Sheedy',
      'Debbie Harry',
      'Olivia Newton-John',
      'Elton John',
      'Michael J. Fox',
      'Axl Rose',
      'Emilio Estevez',
      'Ralph Macchio',
      'Rob Lowe',
      'Jennifer Grey',
      'Mickey Rourke',
      'John Cusack',
      'Matthew Broderick',
      'Justine Bateman',
      'Lisa Bonet',
    ]
      .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5)
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}


const styles = {
    items: {
      background: '#fff',
      borderRadius: '0.5rem',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0px 10px 20px rgba(0, 0, 0, 0.1)',
      color: 'rgba(0, 0, 0, 0.8)',
      fontSize: '0.9rem',
      overflow: 'hidden',
      padding: '0.2rem',
      position: 'relative',
    },
    item: {
      background: 'transparent',
      border: '1px solid transparent',
      borderRadius: '0.4rem',
      display: 'block',
      margin: '0',
      padding: '0.2rem 0.4rem',
      textAlign: 'left',
      width: '100%',
    },
    selectedItem: {
      border: '1px solid #000',
    }
  };

  

export function Mention(props) {
    console.log("PROPS:", props)
  useEffect(() => {
    return () => {
      console.log(`Mention ${props.node.attrs.id} deleted`);
    };
  }, []);

  return (
    <NodeViewWrapper style={{ display: 'inline', width: 'fit-content' }}>
      <span
        style={{
          borderRadius: '0.25rem',
          backgroundColor: 'rgba(0, 123, 255, 0.2)', // Assuming custom-primary-100 is equivalent to a color like #007BFF
          padding: '0.125rem 0.25rem',
          fontWeight: '500',
          color: '#007BFF' // Replace with the actual hex value for custom-primary-100
        }}
      >
        @{props.node.attrs.id}
      </span>
    </NodeViewWrapper>
  );
}


  export const CustomMention = MentionExtension.extend({
    addNodeView() {
      return ReactNodeViewRenderer(Mention);
    },
    parseHTML() {
      return [
        {
          tag: "mention-component",
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["mention-component", mergeAttributes(HTMLAttributes)];
    },
  });