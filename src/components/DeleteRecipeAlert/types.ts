import { DeleteRecipePayload } from 'components/RecipeDrawer/types';

export type Props = {
  recipePayload?: DeleteRecipePayload;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};
