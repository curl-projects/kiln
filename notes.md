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
    - Local storage for dealing with state and browser processing
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


**Bugs**
- Handle error case when the extension isn't allowed to access URL contents

- Want to classify relevance first, and then use that to figure out which goals to show. Only generate the AI response for each goal when it's opened.
- Add system message