import { Meal } from 'types/meal';
import { Time } from 'types/day';

export type Props = {
  day: string;
  meals?: Meal[];
  time: Time;
};
