// import React, { useEffect, useState } from 'react';
// import { FaCheckCircle } from 'react-icons/fa'; // Import FontAwesome checkmark icon

// const CaptureHighlight = () => {
//   const [showCheckmark, setShowCheckmark] = useState(false);
//   const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
//   const [selectedRange, setSelectedRange] = useState(null);

//   const updateSelection = () => {
//     const selection = window.getSelection();
//     if (selection.type === 'Range' && selection.toString().trim() !== '') {
//       setShowCheckmark(true);
//       const range = selection.getRangeAt(0);
//       const rect = range.getBoundingClientRect();
//       setIconPosition({ x: rect.right, y: rect.top });
//       setSelectedRange(range);
//     } else {
//       setShowCheckmark(false);
//       setSelectedRange(null);
//     }
//   };

//   const handleIconClick = () => {
//     if (selectedRange) {
//       const span = document.createElement('span');
//       span.style.backgroundColor = 'orange';
//       try {
//         selectedRange.surroundContents(span);
//       } catch (error) {
//         console.error("Could not surround the contents: ", error.message);
//         // This error typically occurs if the selection spans multiple elements,
//         // which is not allowed by surroundContents. Handle accordingly.
//       }
//       window.getSelection().removeAllRanges(); // Clear selection after applying the highlight
//       setShowCheckmark(false); // Optionally hide the checkmark
//     }
//   };

//   useEffect(() => {
//     const checkSelectionChange = () => {
//       // Use a small delay to ensure that the selection state has updated
//       setTimeout(updateSelection, 10);
//     };

//     document.addEventListener('mouseup', checkSelectionChange);
//     document.addEventListener('keyup', checkSelectionChange);
//     document.addEventListener('click', checkSelectionChange);

//     return () => {
//       document.removeEventListener('mouseup', checkSelectionChange);
//       document.removeEventListener('keyup', checkSelectionChange);
//       document.removeEventListener('click', checkSelectionChange);
//     };
//   }, []);

//   return (
//     <>
//       {showCheckmark && (
//         <div
//           style={{
//             position: 'absolute',
//             left: `${iconPosition.x}px`,
//             top: `${iconPosition.y}px`,
//             cursor: 'pointer'
//           }}
//           onClick={handleIconClick}
//         >
//           <FaCheckCircle size={24} color="black" />
//         </div>
//       )}
//     </>
//   );
// };

// export default CaptureHighlight;
