import { IngredientState, SetIngredientsPayload } from 'store/ingredient/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: IngredientState = {
  fetched: false,
  ingredients: {},
};

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    setIngredients: (state, action: PayloadAction<SetIngredientsPayload>) => {
      if (!state.fetched) {
        state.fetched = true;
      }
      state.ingredients = action.payload.ingredients.reduce(
        (prev, ingredient) => ({ ...prev, [ingredient.id]: ingredient }),
        {},
      );
    },
  },
});

export const { setIngredients } = ingredientSlice.actions;

export default ingredientSlice.reducer;
