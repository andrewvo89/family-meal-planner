import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SetUserPayload, UserState } from 'store/user/types';

const initialState: UserState = {
  fetched: false,
  users: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<SetUserPayload>) => {
      if (!state.fetched) {
        state.fetched = true;
      }
      state.users = action.payload.users.reduce((prev, user) => ({ ...prev, [user.id]: user }), {});
    },
  },
});

export const { setUsers } = userSlice.actions;

export default userSlice.reducer;
