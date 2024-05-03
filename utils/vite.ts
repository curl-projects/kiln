import { type PluginOption } from 'vite';
import makeManifest from './plugins/make-manifest';
import customDynamicImport from './plugins/custom-dynamic-import';
import addHmr from './plugins/add-hmr';
import watchRebuild from './plugins/watch-rebuild';
import inlineVitePreloadScript from './plugins/inline-vite-preload-script';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// // import commonjs from '@rollup/plugin-commonjs';

export const getPlugins = (isDev: boolean): PluginOption[] => [
  makeManifest({ getCacheInvalidationKey }),
  customDynamicImport(),
  // nodeResolve({
  //   browser: true,
  // }),  // Add this to handle node modules
  // commonjs(),     // Add this to handle CommonJS modules
  // You can toggle enable HMR in background script or view
  addHmr({ background: true, view: true, isDev }),
  isDev && watchRebuild({ afterWriteBundle: regenerateCacheInvalidationKey }),
  // For fix issue#177 (https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/177)
  inlineVitePreloadScript(),
];

const cacheInvalidationKeyRef = { current: generateKey() };

export function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}

function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

function generateKey(): string {
  return `${Date.now().toFixed()}`;
}
