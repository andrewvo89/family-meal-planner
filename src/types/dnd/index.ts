import { DragSourceOptions } from 'react-dnd';
import { Time } from 'types/day';

export enum DnDCardType {
  RECIPE_CARD = 'RECIPE_CARD',
  MEAL_CARD = 'MEAL_CARD',
}

export type TimeSectionDropResult = DragSourceOptions & {
  day: string;
  time: Time;
};

export type TimeSectionCollectResult = {
  isOver: boolean;
};

export type RecipeCardCollectResult = {
  isDragging: boolean;
};

export type MealCardCollectResult = {
  isDragging: boolean;
};
