declare module 'lodash/chunk' {
  declare export default function chunk<T>(array: ?Array<T>, size?: number): Array<Array<T>>;
}

declare module 'lodash/debounce' {
  declare export default function debounce(func: Function, wait?: number): Function;
}
