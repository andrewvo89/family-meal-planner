import { TypedUseSelectorHook, useSelector as _useSelector } from 'react-redux';

import { RootState } from 'store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useSelector: TypedUseSelectorHook<RootState> = _useSelector;
