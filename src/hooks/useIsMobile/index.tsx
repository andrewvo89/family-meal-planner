import { useBreakpoint } from '@chakra-ui/react';

export default function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'base';
}
