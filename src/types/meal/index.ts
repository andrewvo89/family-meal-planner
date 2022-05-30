import { Ingredient } from 'types/ingredient';
import { Recipe } from 'types/recipe';
import { Time } from 'types/day';
import { User } from 'types/user';

export type WeekMeals = {
  [date: string]: DayMeals;
};

export type DayMeals = {
  [key in Time]?: Meal[];
};

export type Meal = {
  id: string;
  day: string;
  ingredients: Ingredient[];
  notes: string;
  recipe: Recipe;
  time: Time;
  users: User[];
};

export type MealDB = Omit<Meal, 'id' | 'ingredients' | 'recipe' | 'users'> & {
  ingredients: string[];
  recipe: string;
  users: string[];
};
