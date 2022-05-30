import { Ingredient } from 'types/ingredient';
import { Meal } from 'types/meal';
import { Recipe } from 'types/recipe';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  meals: Meal[];
};

export type RecipeQuantity = {
  recipe: Recipe;
  meals: Meal[];
};

export type CartItem = {
  ingredient: Ingredient;
  recipes: Array<RecipeQuantity>;
  quantity: number;
};
