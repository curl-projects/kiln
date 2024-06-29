import { Plugin } from '@tiptap/pm/state'
import { Node } from '@tiptap/pm/model'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Extension } from '@tiptap/core'

function findColors(doc: Node, data: string[]): DecorationSet {
  console.log("FIND COLORS DATA:", data)
  const regex = new RegExp(data.map(item => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');

  // const hexColor = /(#[0-9a-f]{3,6})\b/gi
  const decorations: Decoration[] = []

  doc.descendants((node, position) => {
    if (!node.text) {
      return
    }

    Array.from(node.text.matchAll(regex)).forEach(match => {
      const color = match[0]
      const index = match.index || 0
      const from = position + index
      const to = from + color.length
      const decoration = Decoration.inline(from, to, {
        class: 'concept',
        // style: `--color: ${color}`,
      })

      decorations.push(decoration)
    })
  })

  return DecorationSet.create(doc, decorations)
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlight: {
      /**
       * Set a highlight mark
       * @param attributes The highlight attributes
       * @example editor.commands.setHighlight({ color: 'red' })
       */
      updateData: (attributes?: { data: string[] }) => ReturnType,

    }
  }
}
 
export const ColorHighlighter = Extension.create({
    name: 'colorHighlighter',

    addCommands() {
      return {
        updateData: ({ data }) => ({ commands }) => {
          console.log("NEW DATA:", data)
          this.storage.data = data
          return true
        },
      }
    },
  

    addStorage() {
      return {
        data: this.options?.data || []
      }
    },

    
    
    addOptions(){
      return {
        data: []
      }
    },
    
  
    addProseMirrorPlugins() {
      console.log("DATA:", this.storage.data)

      const findColorsWithStorage = (doc) => findColors(doc, this.storage.data)

      return [
        new Plugin({
          state: {
            init(_, { doc }) {
              return findColorsWithStorage(doc)
            },
            apply(transaction, oldState) {
              
          
              return transaction.docChanged ? findColorsWithStorage(transaction.doc)  : oldState
            },
          },
          props: {
            decorations(state) {
              return this.getState(state)
            },
          },
        }),
      ]
    },
  })
  