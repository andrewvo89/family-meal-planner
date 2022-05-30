export enum Time {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

export type TimeDetail = {
  [key in Time]: { name: string; order: number };
};

export const TimeDetails: TimeDetail = {
  [Time.BREAKFAST]: {
    name: 'Breakfast',
    order: 1,
  },
  [Time.LUNCH]: {
    name: 'Lunch',
    order: 2,
  },
  [Time.DINNER]: {
    name: 'Dinner',
    order: 3,
  },
};
