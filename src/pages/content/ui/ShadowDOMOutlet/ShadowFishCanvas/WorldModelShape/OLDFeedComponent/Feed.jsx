import { useState, useEffect, useCallback, cloneElement, memo, useMemo, forwardRef, useRef, useLayoutEffect } from 'react';
import cn from 'classnames';

import React from 'react';
import { searchExa } from '@pages/content/ui/ServerFuncs/api.tsx';

import { Rnd } from 'react-rnd';

import { ImSpinner2 } from 'react-icons/im';
import { AiOutlineSearch } from 'react-icons/ai';

import Masks from './Masks.png';
import { VariableSizeGrid } from 'react-window';

import useMeasure from 'react-use-measure';


// import './App.css';
// import bg from './assets/bg.png'

const StreamCover = ({ className, imageOpacity }) => {

  const bgImage = {
    // backgroundImage: `url(${bg})`,
    // zIndex: -1,
    // backgroundSize: "cover",
    // opacity: imageOpacity,
  }

  return (
    <div className={className} style={bgImage} />
  )
}

const Grab = ({ isMoving }) => {
  // A handle to grab and reposition the Input Space

  return (
    <div
      className="bg-gray-400/20 hover:bg-gray-300/20 absolute top-6 right-4 w-6 h-6 rounded-full cursor-grab"
    >
      <div className={cn(
        "w-3 h-3 transition-all duration-200 hover:w-5 hover:h-5 rounded-full bg-white/55 hover:bg-white/95 m-auto hover:mt-0.5 mt-1.5",

      )} />
    </div>
  )

}

const SearchInput = ({ input, setInput, isLoading }) => {
  const [isFocused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '1em';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  let Icon = isLoading ? (
    <ImSpinner2 className='w-4 h-4 mx-auto text-gray-400 hover:text-gray-400 animate-spin' />
  ) : input.length > 0 ? (
    <AiOutlineSearch className='w-4 h-4 mx-auto text-gray-400 hover:text-gray-300' />
  ) : (
    <div/>
  );

  useEffect(() => {
    if (input.length === 0) {
      const placeholders = ["Input (anything you like)", "Type (or paste)"];
      let index = 0;

      const interval = setInterval(() => {
        index = (index + 1) % placeholders.length;
        if (textareaRef.current) {
          textareaRef.current.style.transition = 'opacity 0.5s ease-in-out';
          textareaRef.current.style.opacity = 0;
          setTimeout(() => {
            textareaRef.current.placeholder = placeholders[index];
            textareaRef.current.style.opacity = 0.6;
          }, 500);
        }
      }, 4000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [input]);

  return (
    <div className="flex items-center w-full pl-3.5 pr-2 py-2">
      <textarea
        ref={textareaRef}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        placeholder='Add anything'
        value={input}
        onChange={e => setInput(e.target.value)}
        className={cn(
          "flex-1 bg-white/0 text-md placeholder-gray-200 text-gray-600/60 text-bold pr-8 font-medium leading-6 resize-none focus:outline-none",
        )}
        style={{
          opacity: isFocused ? 1 : 0.35,
          minHeight: '1em',
          maxHeight: '12em',
          overflow: 'scroll',
        }}
      />
      <button className="absolute right-2 bottom-1 rounded-sm w-8 h-8 ">
        {Icon}
      </button>
    </div>

  );
};

const InputSpace = memo(({ isLoading, width = 256, setResults }) => {

  // Contains media and concepts and an input space for search
  
  const [input, setInput] = useState('')
  const [isFocused, setFocused] = useState(false)
  const focus = input.length > 0 || isFocused
  

  const [cache, setCache] = useState(() => {
    const savedCache = localStorage.getItem('searchCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });

  const handleSearch = async () => {
    if (cache[input]) {
      setResults(cache[input]);
      console.log('cache hit');
      return;
    }

    try {
      const data = await searchExa(input);
      const fetchedResults = data.results || [];

      // set results, then augment
      setResults(fetchedResults);

      setCache((prevCache) => {
        const newCache = { ...prevCache, [input]: fetchedResults };
        localStorage.setItem('searchCache', JSON.stringify(newCache));
        return newCache;
      });
    } catch (error) {
      console.error('Error searching Exa:', error);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (input.length > 0) {
      await handleSearch();
    }
  };

  return (
    <div
      className="flex flex-col gap-4"
      style={{ width: width }}
    >
      <form
        onSubmit={(e) => submitRequest(e)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={focus ?
          {
            transform: 'translateX(-2px) translateY(-2px)',
            backgroundColor: `rgb(250 249 250 / 0.55)`,
            borderColor: `rgb(250 249 250 / 0.55)`
          } :
          {}}
        className={cn(
          "flex transition-all duration-200 z-10 justify-between border border-white/10 bg-white/35 rounded-md resize-none w-full",
          { "bg-white/55 border-white/55 shadow-focus": input.length > 0 }
        )
        }
      >
        <div className="w-full">
          {/* <WorldModel width={256} height={300} setInput={setInput}/> */}
          <SearchInput isLoading={isLoading} setInput={setInput} input={input} />
        </div>
      </form>

      <StreamCover
        className={cn(
          "absolute z-0 w-full h-full top-0 overflow-visible left-0 transition-all duration-300",
          {
            "opacity-70 blur-xl": !(isFocused),
            "opacity-80 blur-xl": isFocused,
          
          },
        )}
        imageOpacity={1}
      />
    </div>
  )
})


const Feed = memo(({ content, anchorPoint, isMoving }) => {

  // accepts content and renders a grid of content in a chosen order
  // manages their focus

  content = [{}, ...content, {}]

  // Params for VariableSizeGrid (can ignore)
  const [anchorLeft, anchorTop] = anchorPoint
  const GUTTER = 22
  const innerElementType = forwardRef(({ style, ...rest }, ref) => (
    <div
      ref={ref}
      style={{
        ...style,
        paddingTop: GUTTER,
        paddingRight: GUTTER,
      }}
      {...rest}
    />
  ));
  // Dynamically sizing rows
  const gridRef = useRef(null)
  const scrollRef = useRef(null)

  const scrollTo = useCallback((scrollOffset) => {
    scrollRef?.current?.scrollTo({
      left: 0,
      top: scrollOffset,
      behavior: 'smooth',
    })
  }, [])

  const rowSizes = useRef({})
  const setRowSize = (index, size) => {

    rowSizes.current = { ...rowSizes.current, [index]: size }
    gridRef?.current?.resetAfterRowIndex(index, false)
  }

  const rowFocus = useRef({})
  const setRowFocus = (index, focus) => {
    rowFocus.current = { ...rowFocus.current, [index]: focus }
  }

  const getRowSize = index => rowSizes.current[index] + GUTTER || 200
  const getRowFocus = index => rowFocus.current[index] || 0.5

  const nCols = 1
  const remainingWidth = window.innerWidth - anchorLeft
  const colWidth = Math.min(392, remainingWidth / nCols)

  const nRows = Math.ceil(content?.length / nCols)

  // only render if there is content to render
  if (!content) return null

  return (
    <div
      className='feed z-10 pl-6'
      style={{ position: 'relative', overflow: 'visible', left: anchorLeft, top: 0 }}
    >

      <VariableSizeGrid

        ref={gridRef}
        outerRef={scrollRef}

        width={remainingWidth}
        height={window.innerHeight}
        style={{ overflowX: 'visible', overflowY: 'scroll' }}

        columnCount={nCols}
        columnWidth={() => colWidth}

        rowCount={nRows}
        rowHeight={getRowSize}

        useIsScrolling

        innerElementType={innerElementType}
        overscanRowCount={1}

        itemData={content}

      >
        {({ data, columnIndex, rowIndex, style, isScrolling }) => {


          const index = rowIndex * nCols + columnIndex
          const content = nCols > 1 ? data[index] : data[rowIndex]

          if (index === 0 || index === data.length - 1) {
            return (
              <div
                style={{ ...style, width: colWidth, height: anchorTop }}
              />
            )
          }

          return (
            <Card

              content={content}

              isScrolling={isScrolling}
              scrollTo={scrollTo}

              style={style}

              isMoving={isMoving}

              setRowSize={setRowSize}
              getRowSize={getRowSize}

              setRowFocus={setRowFocus}
              getRowFocus={getRowFocus}

              ref={gridRef}

              index={rowIndex}
              anchorTop={anchorTop}
            />
          )
        }
        }
      </VariableSizeGrid>
    </div>
  )
},)

const Card = forwardRef((props, gridRef) => {
  // Higher Order Component that manages the Card's focus and position

  const { content, scrollTo, style, isScrolling, index, isMoving, setRowSize, getRowFocus, setRowFocus, anchorTop } = props
  const GUTTER = 22

  const cardRef = useRef()

  // a scalar value [0,1] that represents how focused the Card is relative to the sidebar
  const [focus, setFocus] = useState(getRowFocus(index) || 0)
  const prevFocus = useRef(getRowFocus(index) || null)

  // set the focus of the Card based on its position in the viewport
  const [focusRef, bounds] = useMeasure({ scroll: true, debounce: { scroll: 10, resize: 10 } });

  // distance from Card to Anchor Top
  const distFromAnchor = bounds.top - anchorTop + 16
  // if scrolling has stopped, snap to sidebar
  useLayoutEffect(() => {
    if (!isScrolling) {
      if (focus > 0.80 && focus < 0.90) {
        scrollTo(style.top - anchorTop + 16)
      }
    }
  }, [isScrolling])


  // manage focus
  useLayoutEffect(() => {

    if (cardRef?.current) {
      const cardHeight = cardRef.current?.getBoundingClientRect().height
      setRowSize(index, cardHeight + 16 * isFocused)
      gridRef?.current?.resetAfterRowIndex(index, false)

    }

    // if Card is below sidebar Anchor

    if (distFromAnchor > 0) {

      // scale focus[0,1] based on distance from sidebar
      let remainingDistance = window.innerHeight - anchorTop
      let focus = 1 - (distFromAnchor / remainingDistance)
      setFocus(focus)
      setRowFocus(index, focus)

    } else {
      // above the Sidebar

      let remainingDistance = anchorTop
      let focus = (bounds.top / remainingDistance)

      setFocus(focus)
      setRowFocus(index, focus)

    }

  }, [bounds, anchorTop, isMoving])


  const focusThreshold = 0.75
  const focusStyle = {
    opacity: focus > focusThreshold ? 1 : 0.2 + focus * 0.5,
    transform: focus > focusThreshold ? `scale(${1 + 0.05 * focus})` : `scale(1.00)`,
    padding: '12px 12px 16px',
    transition: `all ${0.2 * focus}s ease-in-out`,
    boxShadow: focus > focusThreshold ? `0px ${focus * 42}px 42px -4px rgba(77,77,77,0.15)` : 'none',

  }

  const isFocused = (distFromAnchor > 0 && focus > focusThreshold)

  const openContext = isFocused && !isMoving
  const yMargin = GUTTER
  const offsetLeft = bounds.width + GUTTER

  const scrollOnClick = () => {
    if (focus < 0.75) {
      scrollTo(style.top - anchorTop + yMargin)
    }
  }


  return (
    <div

      key={content.id}
      ref={focusRef}
      // absolutely position by Card by Grid
      style={{
        ...style,
        top: style.top + yMargin,
        height: style.height - yMargin,
        width: style.width - yMargin,
        left: style.left + 2 * yMargin,
        transition: `top ${0.2}s ease-in-out`
      }}
      onClick={scrollOnClick}
    >
      <div
        className={cn("card min-w-24 flex",
        )}
        style={isMoving ? { opacity: 0.1 } : focusStyle}
        ref={cardRef}
      >
        <ExaResult result={content} isFocused={isFocused} />
      </div>


    </div>

  )


})

const Section = ({ title, subtitle, url, isFocused }) => {

  const handleTitleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <div className='mx-2 grow flex gap-4 justify-between items-baseline'>
      <div className="w-2/5 grow flex items-baseline gap-4">
        <div className="flex flex-col">
          <h3
            className={cn(
              'hover:underline font-display cursor-pointer text-base leading-5 shrink text-gray-100 ',
              'shrink items-baseline gap-2'
            )}
            onClick={handleTitleClick}
          >
            {title}
          </h3>
          {/* {subtitle && (
            <div className="flex items-center pt-1">
              <AiOutlineGlobal className="text-gray-100/60 mr-2 w-4 h-4" />
              <h4
                className={cn(
                  'text-gray-100/60 text-sm leading-4'
                )}
              >
                {subtitle}
              </h4>
            </div>
          )} */}
        </div>
      </div>
    </div>
  )


}

const ExaResult = memo(({ result, isFocused }) => {

  const insertHighlights = (text, highlights) => {
    if (!highlights || highlights.length === 0) return text;

    let result = [];
    let lastIndex = 0;

    highlights.sort((a, b) => a.start - b.start);

    highlights.forEach(({ start, end, type }) => {
      if (start > lastIndex) {
        result.push(text.slice(lastIndex, start));
      }
      result.push(`<span class="highlight highlight-${type}">${text.slice(start, end)}</span>`);
      lastIndex = end;
    });

    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result.join('');
  };

  const highlightedText = insertHighlights(result.text, result.highlights);

  const formatWebsiteName = useMemo(() => (url) => {
    try {
      const hostname = new URL(url).hostname;
      const nameParts = hostname.split('.');
      if (nameParts.length > 1) {
        return nameParts[nameParts.length - 2]
          .replace(/-/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
      }
      return hostname;
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  }, []);



  return (

    <div
      className="flex-1 w-4/5 flex flex-col gap-4"
    >

      {/* ContentBody (either text or text + image if any) */}
      <p
        data-cy='text'
        className={cn("text-gray-100 card -my-2 font-normal leading-5 h-[24em] overflow-y-scroll ",
          { "shadow-lg transform -translate-y-4": isFocused })}
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />

      {/* Header (Site Title, timestamp)  */}
      <Section
        title={result.title}
        url={result.url}
        isFocused={isFocused}
      />




    </div>
  )



})

export function WorldModelFeed() {

  const [size, setSize] = useState({
    width: 256,
    height: 180,
    x: 0,
    y: 0
  })

  // Top Right Edge of Input Space, used to anchor outputs
  const anchorX = size.width
  const anchorY = size.height

  // If the Input Space is being moved
  const [isMoving, setisMoving] = useState(false)

  // Search State
  const [results, setResults] = useState([])


  return (
    <div className="app-bg">
      <Rnd
        minWidth={'56px'}
        minHeight={'128px'}

        bounds="window"
        className='z-50'

        dragGrid={[56, 56]}
        default={{
          x: 0,
          y: 0,
          width: anchorX,
          height: anchorY,
        }}
        size={
          {
            width: anchorX,
            height: anchorY,
          }
        }
        position={
          {
            x: size.x,
            y: size.y,
          }
        }

        resizeHandleComponent={
          {
            bottomRight: <Grab isMoving={isMoving} />
          }
        }

        maxHeight={window.innerHeight - 128}
        maxWidth={window.innerWidth - 400}

        enableResizing={
          {
            top: false,
            bottomRight: true,
            left: false,
          }
        }

        disableDragging

        onResizeStart={() => setisMoving(true)}

        onResizeStop={() => setisMoving(false)}

        onResize={
          (e, dir, ref, delta, pos) => {

            setSize(
              {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: parseInt(ref.style.x),
                y: parseInt(ref.style.y)
              }
            )
          }
        }
      />

      <div className="fixed z-40" style={{ top: anchorY, left: anchorX }}>
        <InputSpace
          width={256}
          setResults={setResults}
        />
      </div>

      <Feed
        content={results}
        anchorPoint={[anchorX + 256, anchorY]}
        isMoving={isMoving}
      />


      <WorldBackdrop
        isMoving={isMoving}
        sidebarLeft={anchorX}
        anchorTop={anchorY}
      />

    </div>


  );
}

const WorldBackdrop = ({ anchorTop, sidebarLeft, isMoving, worldName = "curl.craft" }) => {
  // Renders a vignetted background and label of the World Model

  const bgImage = {
    backgroundImage: `url(${Masks})`,
    zIndex: 0,
    backgroundSize: "cover",
  }

  const displace = isMoving ? 0 : 0

  return (
    <>
      <div
        className='absolute tracking-tighter text-gray-500/60 font-semibold z-0'
        style={{
          top: anchorTop - 64 + displace,
          left: sidebarLeft + 156 - displace,
          transform: isMoving ? `scale(0.95)` : `scale(1)`,
          transition: 'transform 0.1s ease-in-out',
          fontSize: '5rem',
          userSelect: 'none',
          zIndex: '1'
        }}
      >
        {worldName}
      </div>
      <div
        style={bgImage}
        className={"fixed top-0 left-0 w-screen h-screen z-10"}
      />
    </>
  )
}