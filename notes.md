**Links**
- https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite

- https://github.com/lxieyang chrome-extension-boilerplate-react

- https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/sample.sidepanel-dictionary/sidepanel.js

- https://stackoverflow.com/questions/19758028/chrome-extension-get-dom-content

- https://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension

- https://stackoverflow.com/questions/13917047/how-to-get-a-content-script-to-load-after-a-pages-javascript-has-executed/13917682#13917682

- https://stackoverflow.com/questions/3652657/what-algorithm-does-readability-use-for-extracting-text-from-urls

- https://stackoverflow.com/questions/33891973/webpack-and-programmatically-injected-content-scripts?rq=4

- https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/56

- https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/124

- https://dev.to/bnn1/how-do-they-talk-to-each-other-2p9

- https://stackoverflow.com/questions/59295317/how-to-wait-for-content-script-listener-to-load-after-background-script-opens-ur

- https://stackoverflow.com/questions/51389227/send-message-to-content-script-after-page-load

- https://anik8das.medium.com/how-to-add-firebase-to-a-chrome-extension-on-manifest-v3-63a16a4080ef

- https://medium.com/the-andela-way/authenticate-your-chrome-extension-user-through-your-web-app-dbdb96224e41

- https://rebeccamdeprey.com/blog/render-openai-stream-responses-with-react

- https://javascriptcentric.medium.com/how-to-use-openai-with-react-212d7d632854

- https://medium.com/@hxu296/serving-openai-stream-with-fastapi-and-consuming-with-react-js-part-1-8d482eb89702

- https://markus.oberlehner.net/blog/building-a-chatgpt-client-with-remix-leveraging-response-streaming-for-a-chat-like-experience/

- https://github.com/openai/openai-node/issues/341

- https://medium.com/@joshua.v.sanger/implementing-toolformer-with-openai-and-remix-22997dd46499

- https://dev.to/franciscomendes10866/building-real-time-applications-with-remixjs-server-sent-events-and-job-queues-315f 

- https://github.com/openai/openai-node/issues/18

- https://stackoverflow.com/questions/62340697/react-query-how-to-usequery-when-button-is-clicked

- https://stackoverflow.com/questions/77992304/import-a-node-module-in-a-content-script-of-a-chrome-extension-vite-and-react

- https://stackoverflow.com/questions/36599147/proper-way-to-inject-react-component-onto-page-in-chrome-extension

- https://dev.to/anobjectisa/build-a-chrome-extension-using-reactjs-38o7

- https://medium.com/code-monkey/react-aquarium-3b61ce79abae

- https://github.com/kaizhelam/Koi-Fish

**Done**
- Read page context
    - Find action associated with page changing
    - Store in chrome storage until sidepanel is opened
    - Pass info from the service worker to components
    - Read from chrome storage to state
- Perform API calls and change state
- Content scripts
- Generate only when on a page with text (e.g. 
not a search page)
    - Prisma storage for database management
        - Schematization and API service
        - Consume goals from the extension
            - Fetch API connection
            - Set up the routes on the API side
                - Fetch goals for user
- Authentication on the chrome extension
    - Fetch google information and load into state

**To Do**
- Implement some type of storage 
    - Local storage for dealing with state and browser processing and other things
        - Integrate with session db for:
            - Storing authentication details, etc. that persist across tab loads
            - Caching generated text and processing, probably organized using tab ids
- Stream AI responses
    - TODO: FIX CHAT RESPONSE STUFF
    - Wait for data to be loaded in
    - Don't interrupt stream once it's started
    - Show text incrementally as you stream in info

- RELEVANCE:
    - Could do vector embeddings or ask the AI 
    - Probably just ask the AI




- Figure out what goals are relevant to each page

- Implement a saving mechanism that tracks links that are highly relevant to each page

- Other Tasks
    - Failure States
    - Loading Hooks
    - Caching

- Do this
    - Do this first   


**Bugs**
- Handle error case when the extension isn't allowed to access URL contents

- Want to classify relevance first, and then use that to figure out which goals to show. Only generate the AI response for each goal when it's opened.
- Add system message


- Avoid nested component waterfalls for the goals view

- TODO: add the queryCaching feature thingy to make everything much faster

   
    - 

- Add a timer and use it to coordinate activity 
- Add suggested tasks

- Maybe suggested functionality like bubbles below the box?


- THINGS TO DO:
    - AI MEMORY: SHORT-TERM & LONG-TERM
    - SUGGESTED TASKS
    - INJECTING CONTENT DIRECTLY INTO THE PAGE
    - IDENTIFYING DIVS TO HIGHLIGHT


    - SUBDOMAINS!!

- MARKDOWN FOR CHATBOT RESPONSE

- Architecture
    - Decoupled relevance pipeline and hook
    - Pipeline for uploading tasks as they're created, and deleting them when they're destroyed.
    - Use metadata filtering for goals, tasks, etc.
        - Descriptions should be included.
        - Build some replicable system for including pinecone set up/tear down in the CRUD queries for objects in the database

- Flow
1. Split up every sentence in the 


1. malia gets to GG park around 7pm
2. 17 minutes home, 11 minutes walk, 10 minutes waiting, 10 minutes walgreens, 25 minutes cycle = 73 minutes 

**When you open a new page**
1. Identify relevant tasks, and reorganize task list
    1. Make the "ADD PAGE" button very rivisble 
2. Provide three things to think about

*TODO*
- Stop stream if they spam enter