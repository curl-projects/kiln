import React, { useEffect, useState } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, useEditor,  } from 'tldraw';
import { HTMLContainer, ShapeUtil } from 'tldraw'
import { CardShapeUtil } from './ShapeWrapper/ShapeWrapper.tsx'

export default function ShadowCanvas({ parsedContent }) {
//   const [store] = useState(() => createTLStore({ shapeUtils }));
  const customShapeUtils = [CardShapeUtil]


  return (
    <Tldraw
      shapeUtils={customShapeUtils}
      onMount={(editor)=>{
        editor.createShapes([{ type: 'finnCard', props: {config: "fish"}}])
      }}
    />
  );
}