// 'use client'

// // https://github.com/ueberdosis/tiptap/blob/a706df78c2df8235b6b1825a71fccf8539fe9700/packages/extension-code-block/src/code-block.ts
// import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core';
// import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
// import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
// import { CodeBlockOptions } from '@titap/extension-codep-block';
// import { Terminal } from '@/components';
// import { backtickInputRegex, tildeInputRegex } from '@/utils';

// export interface TerminalBlock extends CodeBlockOptions {
// }

// // Step 1: Create a Custom Node Extension
// export const TerminalBlock = Node.create({
//   name: 'terminalBlock',

//   addOptions() {
//     return {
//       languageClassPrefix: 'language-',
//     }
//   },

//   content: 'text*',

//   marks: '',

//   group: 'block',

//   code: true,

//   defining: true,

//   addAttributes() {
//     return {
//       ...this.parent?.(),
//       language: {
//         default: null,
//         parseHTML: element => {
//           const { languageClassPrefix } = this.options
//           const classNames = [...(element.firstElementChild?.classList || [])]
//           const languages = classNames
//             .filter(className => className.startsWith(languageClassPrefix))
//             .map(className => className.replace(languageClassPrefix, ''))
//           const language = languages[0]

//           if (!language) {
//             return null
//           }

//           return language
//         },
//         rendered: false,
//       },
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'pre',
//         preserveWhitespace: 'full',
//       },
//     ]
//   },

//   renderHTML({ node, HTMLAttributes }) {
//     return [
//       'pre',
//       mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
//       [
//         'code',
//         {
//           class: node.attrs.language
//             ? this.options.languageClassPrefix + node.attrs.language
//             : null,
//         },
//         0,
//       ],
//     ]
//   },

//   addCommands() {
//     return {
//       setCodeBlock:
//         attributes => ({ commands }) => {
//           return commands.setNode(this.name, attributes)
//         },
//       toggleCodeBlock:
//         attributes => ({ commands }) => {
//           return commands.toggleNode(this.name, 'paragraph', attributes)
//         },
//     }
//   },

//   addKeyboardShortcuts() {
//     return {
//       'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),

//       // remove code block when at start of document or code block is empty
//       Backspace: () => {
//         const { empty, $anchor } = this.editor.state.selection
//         const isAtStart = $anchor.pos === 1

//         if (!empty || $anchor.parent.type.name !== this.name) {
//           return false
//         }

//         if (isAtStart || !$anchor.parent.textContent.length) {
//           return this.editor.commands.clearNodes()
//         }

//         return false
//       },

//       // exit node on triple enter
//       Enter: ({ editor }) => {
//         if (!this.options.exitOnTripleEnter) {
//           return false
//         }

//         const { state } = editor
//         const { selection } = state
//         const { $from, empty } = selection

//         if (!empty || $from.parent.type !== this.type) {
//           return false
//         }

//         const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
//         const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

//         if (!isAtEnd || !endsWithDoubleNewline) {
//           return false
//         }

//         return editor
//           .chain()
//           .command(({ tr }) => {
//             tr.delete($from.pos - 2, $from.pos)

//             return true
//           })
//           .exitCode()
//           .run()
//       },

//       // exit node on arrow down
//       ArrowDown: ({ editor }) => {
//         if (!this.options.exitOnArrowDown) {
//           return false
//         }

//         const { state } = editor
//         const { selection, doc } = state
//         const { $from, empty } = selection

//         if (!empty || $from.parent.type !== this.type) {
//           return false
//         }

//         const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2

//         if (!isAtEnd) {
//           return false
//         }

//         const after = $from.after()

//         if (after === undefined) {
//           return false
//         }

//         const nodeAfter = doc.nodeAt(after)

//         if (nodeAfter) {
//           return false
//         }

//         return editor.commands.exitCode()
//       },
//     }
//   },

//   addInputRules() {
//     return [
//       textblockTypeInputRule({
//         find: backtickInputRegex,
//         type: this.type,
//         getAttributes: match => ({
//           language: match[1],
//         }),
//       }),
//       textblockTypeInputRule({
//         find: tildeInputRegex,
//         type: this.type,
//         getAttributes: match => ({
//           language: match[1],
//         }),
//       }),
//     ]
//   },

//   addProseMirrorPlugins() {
//     return [
//       // this plugin creates a code block for pasted content from VS Code
//       // we can also detect the copied code language
//       new Plugin({
//         key: new PluginKey('codeBlockVSCodeHandler'),
//         props: {
//           handlePaste: (view, event) => {
//             if (!event.clipboardData) {
//               return false
//             }

//             // don’t create a new code block within code blocks
//             if (this.editor.isActive(this.type.name)) {
//               return false
//             }

//             const text = event.clipboardData.getData('text/plain')
//             const vscode = event.clipboardData.getData('vscode-editor-data')
//             const vscodeData = vscode ? JSON.parse(vscode) : undefined
//             const language = vscodeData?.mode

//             if (!text || !language) {
//               return false
//             }

//             const { tr } = view.state

//             // create an empty code block
//             tr.replaceSelectionWith(this.type.create({ language }))

//             // put cursor inside the newly created code block
//             tr.setSelection(TextSelection.near(tr.doc.resolve(Math.max(0, tr.selection.from - 2))))

//             // add text to code block
//             // strip carriage return chars from text pasted as code
//             // see: https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
//             tr.insertText(text.replace(/\r\n?/g, '\n'))

//             // store meta information
//             // this is useful for other plugins that depends on the paste event
//             // like the paste rule plugin
//             tr.setMeta('paste', true)

//             view.dispatch(tr)

//             return true
//           },
//         },
//       }),
//     ]
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(({ node }: any) => {
//       return (
//         <NodeViewWrapper className="relative p-1">
//           <Terminal language={node.attrs.language} code={node.textContent} />
//         </NodeViewWrapper>
//       );
//     });
//   },
// });
