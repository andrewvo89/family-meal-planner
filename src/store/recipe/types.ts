import { Recipe } from 'types/recipe';

export type RecipeState = {
  fetched: boolean;
  recipes: {
    [id: string]: Recipe;
  };
};

export type SetRecipePayload = {
  recipes: Recipe[];
};
