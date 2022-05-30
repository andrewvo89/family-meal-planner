import { DayMeals } from 'types/meal';

export type Props = {
  day: string;
  meals?: DayMeals;
  isLast: boolean;
  width: number;
  onClick: () => void;
};
