import { Airbnb, Apple, AppleAppStore, ApplePay, AWS, DeepMind, Facebook, Meta, Github, HuggingFace, OpenAI, Wikipedia, Youtube, Instagram, Android, Atom, CodePen, CodeSandbox, Discord, Jetbrains, JetbrainsSpace, Pycharm, Eclipse, KhanAcademy, LinuxKernel, Linkedin, Microsoft, Windows, Netflix, Reddit, Replit, Slack, StackOverflow, Tidal, TikTok, Todoist, Tumblr, Firefox, Figma, Safari, Putty, Chrome, Google, GoogleDeveloper, GoogleDrive, GooglePay, GooglePlay, GoogleDomains, VSCode, Anaconda, Angular, Angularjs, Asteroid, Matplotlib, Bootstrap, CMake, Debian, D3js, TensorFlow, JAX, Caffe2, Keras, Diffusers, JupyterNotebook, Onnx, SafeTensor, ESPnet, spaCy, Fastai, PaddlePaddle, CoreML, Flair, SpeechBrain, Stanza, OpenVINO, Pytorch, Docker, Seaborn, Svelte, Tailwindcss, React, ReactQuery, Numpy, Plotly, Pandas, arXiv, csulb, Cornell, lilianweng, MindProject, Vercel, Tldraw, TipTap, StackBlitz } from '../CustomIcons/Logos';
// import { IconSet } from '@/components';

export interface IconSet {
  [iconName: string]: any;
}

export const LogosIconSet: IconSet = {
  Airbnb, Apple, AppleAppStore, ApplePay, AWS, DeepMind, Facebook, Meta, Github, HuggingFace, OpenAI, Wikipedia, Youtube, Instagram, Android, Atom, CodePen, CodeSandbox, Discord, Jetbrains, JetbrainsSpace, Pycharm, Eclipse, KhanAcademy, LinuxKernel, Linkedin, Microsoft, Windows, Netflix, Reddit, Replit, Slack, StackOverflow, Tidal, TikTok, Todoist, Tumblr, Firefox, Figma, Safari, Putty, Chrome, Google, GoogleDeveloper, GoogleDrive, GooglePay, GooglePlay, GoogleDomains, VSCode, Anaconda, Angular, Angularjs, Asteroid, Matplotlib, Bootstrap, CMake, Debian, D3js, TensorFlow, JAX, Caffe2, Keras, Diffusers, JupyterNotebook, Onnx, SafeTensor, ESPnet, spaCy, Fastai, PaddlePaddle, CoreML, Flair, SpeechBrain, Stanza, OpenVINO, Pytorch, Docker, Seaborn, Svelte, Tailwindcss, React, ReactQuery, Numpy, Plotly, Pandas, arXiv, csulb, Cornell, lilianweng, MindProject, Vercel, Tldraw, TipTap, StackBlitz
};
export const LogosIconNames = Object.keys(LogosIconSet);
export type LogosIcon = keyof typeof LogosIconSet;
