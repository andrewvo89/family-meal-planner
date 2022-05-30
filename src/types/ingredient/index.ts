export type Ingredient = {
  id: string;
  name: string;
};

export type IngredientDB = Omit<Ingredient, 'id'>;
