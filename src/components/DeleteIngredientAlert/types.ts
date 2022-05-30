import { DeleteIngredientPayload } from 'components/RecipeDrawer/types';

export type Props = {
  ingredientPayload?: DeleteIngredientPayload;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};
