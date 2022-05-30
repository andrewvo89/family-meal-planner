import { AppDispatch } from 'store';
import { useDispatch as _useDispatch } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDispatch = () => _useDispatch<AppDispatch>();
