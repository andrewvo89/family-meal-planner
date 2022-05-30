import { Ingredient } from 'types/ingredient';
import { Meal } from 'types/meal';
import { Recipe } from 'types/recipe';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  recipe?: Recipe;
};

export type DeleteIngredientPayload = {
  ingredient: Ingredient;
  recipes: Recipe[];
};

export type DeleteRecipePayload = {
  recipe: Recipe;
  meals: Meal[];
};
