const TITLE_REGEX = /(^|:|\.)\s?[a-z]/g;

export function useTitleFormat(title: string): string {
  return title.replace(TITLE_REGEX, (token) => token.toUpperCase());
}
