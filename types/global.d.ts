declare module 'escape-html' {
  export default function escapeHtml(markup: string): string;
}

declare module 'style-parser' {
  export default function parse(style: string): object;
}

declare const __DEV__: boolean;
declare const __webpack_require__: Function;
declare const __non_webpack_require__: Function;
