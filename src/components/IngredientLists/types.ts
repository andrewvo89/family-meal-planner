import { Ingredient } from 'types/ingredient';

export type Props = {
  ingredients: Ingredient[];
  selectedIngredients: Set<Ingredient>;
  onDelete: (ingredient: Ingredient) => void;
  onUpdate: (id: string, name: string) => Promise<void>;
  onSelect: (ingredients: Set<Ingredient>) => void;
};
