import { configureStore } from '@reduxjs/toolkit';
import ingredientReducer from 'store/ingredient';
import recipeReducer from 'store/recipe';
import userReducer from 'store/user';

export const store = configureStore({
  reducer: { ingredientState: ingredientReducer, recipeState: recipeReducer, userState: userReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
