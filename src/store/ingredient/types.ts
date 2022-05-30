import { Ingredient } from 'types/ingredient';

export type IngredientState = {
  fetched: boolean;
  ingredients: {
    [id: string]: Ingredient;
  };
};

export type SetIngredientsPayload = {
  ingredients: Ingredient[];
};
