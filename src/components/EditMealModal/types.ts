import { Meal } from 'types/meal';

export type Props = {
  meal: Meal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (users: Set<string>, ingredients: Set<string>, notes: string) => Promise<void>;
};
