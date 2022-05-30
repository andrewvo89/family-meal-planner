import { Ingredient } from 'types/ingredient';

export type Recipe = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

export type RecipeDB = Omit<Recipe, 'id' | 'ingredients'> & {
  ingredients: string[];
};
