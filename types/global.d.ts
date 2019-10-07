declare module 'escape-html' {
  export default function escapeHtml(markup: string): string;
}

declare module 'style-parser' {
  export default function parse(style: string): object;
}

declare const __DEV__: boolean;
