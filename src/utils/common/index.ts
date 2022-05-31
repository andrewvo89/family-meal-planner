import { IsLoading } from 'types/common';

export function isAnyLoading(isLoading: IsLoading): boolean {
  return Object.values(isLoading).some((domain) => Object.values(domain).includes(true));
}

export function sortWithEmoji(stringA: string, stringB: string): number {
  return stringA
    .replace(/\p{Emoji}/gu, '')
    .trim()
    .localeCompare(stringB.replace(/\p{Emoji}/gu, '').trim());
}
