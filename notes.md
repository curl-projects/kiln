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

**To Do**
- Implement some type of storage 
    - Local storage for dealing with state and browser processing
    - Prisma storage for database management
        - Schematization and API service
        - Consume goals from the extension
            - Fetch API connection
            - Set up the routes on the API side
                - Fetch goals for user
        - Authentication on the chrome extension
            - Option: Extension authentication through a web app

**Google Auth**
- 