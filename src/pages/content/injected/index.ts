/**
 * DO NOT USE import someModule from '...';
 *
 * @issue-url https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/160
 *
 * çChrome extensions don't support modules in content scripts.
 * If you want to use other modules in content scripts, you need to import them via these files.
 *
 */
// import('@root/src/pages/content/injected/pageContent');
import('@pages/content/injected/pageContent');
