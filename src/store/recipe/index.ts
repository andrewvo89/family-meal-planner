import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RecipeState, SetRecipePayload } from 'store/recipe/types';

const initialState: RecipeState = {
  fetched: false,
  recipes: {},
};

export const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<SetRecipePayload>) => {
      if (!state.fetched) {
        state.fetched = true;
      }
      state.recipes = action.payload.recipes.reduce((prev, recipe) => ({ ...prev, [recipe.id]: recipe }), {});
    },
  },
});

export const { setRecipes } = recipeSlice.actions;

export default recipeSlice.reducer;
