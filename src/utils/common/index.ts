import { IsLoading } from 'types/common';

export function isAnyLoading(isLoading: IsLoading): boolean {
  return Object.values(isLoading).some((domain) => Object.values(domain).includes(true));
}
