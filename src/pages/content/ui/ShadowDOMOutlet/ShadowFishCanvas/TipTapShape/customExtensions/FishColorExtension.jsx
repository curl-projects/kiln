import { Extension } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

const FishHighlight = Extension.create({
  name: 'fishHighlight',

  addNodeView() {
    console.log("addNodeView called");
    return ReactNodeViewRenderer(FishNode);
},

addGlobalAttributes() {
    console.log("addGlobalAttributes called");
    return [
        {
            types: ['paragraph'], // Simplify to very common types
            attributes: {
                dataFish: {
                    default: null,
                    parseHTML: element => element.getAttribute('data-fish'),
                    renderHTML: attributes => {
                        if (!attributes.dataFish) {
                            return {};
                        }
                        return { 'data-fish': attributes.dataFish };
                    },
                },
            },
        },
    ];
},
});


const FishNode = ({ node }) => {
  console.log("FISH NODE RENDERED");
  return <div>Static Test Content</div>;
};

// const FishNode = ({ node }) => {
//   console.log("FISH NODE:", node)
//   const content = node.content.content
//     .map((child) => {
//       if (child.type.name === 'text') {
//         const regex = /finn/g;
//         let match;
//         let lastIndex = 0;
//         const parts = [];

//         while ((match = regex.exec(child.text)) !== null) {
//           const start = match.index;
//           const end = start + match[0].length;

//           if (start > lastIndex) {
//             parts.push(child.text.slice(lastIndex, start));
//           }
//           parts.push(
//             <span key={start} className="fish-highlight">
//               {child.text.slice(start, end)}
//             </span>
//           );
//           lastIndex = end;
//         }

//         if (lastIndex < child.text.length) {
//           parts.push(child.text.slice(lastIndex));
//         }

//         return parts;
//       }
//       return child.text;
//     })
//     .flat();

//   return <>{content}</>;
// };

export default FishHighlight;