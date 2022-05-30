import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  Input,
} from '@chakra-ui/react';
import {
  CollectionReference,
  DocumentReference,
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { DeleteIngredientPayload, DeleteRecipePayload, Props } from 'components/RecipeDrawer/types';
import { Fragment, useEffect, useState } from 'react';
import { Ingredient, IngredientDB } from 'types/ingredient';
import { Meal, MealDB } from 'types/meal';
import { Recipe, RecipeDB } from 'types/recipe';

import AddIngredientInput from 'components/AddIngredientInput';
import DeleteIngredientAlert from 'components/DeleteIngredientAlert';
import DeleteRecipeAlert from 'components/DeleteRecipeAlert';
import IngredientLists from 'components/IngredientLists';
import { IsLoading } from 'types/common';
import { TimeDetails } from 'types/day';
import { firestore } from '_firebase';
import { isAnyLoading } from 'utils/common';
import { useSelector } from 'hooks/useSelector';

const initialIsLoading: IsLoading = {
  ingredient: { create: false, update: false, delete: false },
  recipe: { create: false, update: false, delete: false },
};

export default function RecipeDrawer(props: Props): JSX.Element {
  const { isOpen, onClose, recipe } = props;

  const [name, setName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<Ingredient>>(new Set());
  const [isLoading, setIsLoading] = useState<IsLoading>(initialIsLoading);
  const [deleteIngredient, setDeleteIngredient] = useState<DeleteIngredientPayload>();
  const [deleteRecipe, setDeleteRecipe] = useState<DeleteRecipePayload>();

  const ingredients = useSelector((state) => state.ingredientState.ingredients);
  const recipes = useSelector((state) => state.recipeState.recipes);
  const users = useSelector((state) => state.userState.users);

  useEffect(() => {
    setName(recipe?.name ?? '');
    setSelectedIngredients(new Set(recipe?.ingredients ?? []));
  }, [recipe]);

  function onDrawerClose() {
    setIsLoading(initialIsLoading);
    setDeleteIngredient(undefined);
    setDeleteRecipe(undefined);
    onClose();
  }

  async function onUpdateIngredient(id: string, name: string) {
    setIsLoading({ ...isLoading, ingredient: { ...isLoading.ingredient, update: true } });
    await updateDoc(doc(firestore, `ingredients/${id}`) as DocumentReference<IngredientDB>, { name });
    setIsLoading({ ...isLoading, ingredient: { ...isLoading.ingredient, update: false } });
  }

  function onPromptDeleteIngredient(ingredient: Ingredient) {
    const deleteRecipes = Object.values(recipes).reduce<Recipe[]>(
      (prev, recipe) => (recipe.ingredients.some((i) => i.id === ingredient.id) ? [...prev, recipe] : prev),
      [],
    );
    setDeleteIngredient({ ingredient, recipes: deleteRecipes });
  }

  async function onDeleteIngredient() {
    if (!deleteIngredient) {
      return;
    }
    const { ingredient, recipes } = deleteIngredient;
    setIsLoading({ ...isLoading, ingredient: { ...isLoading.ingredient, delete: true } });
    const snapshot = await getDocs(
      query(
        collection(firestore, 'meals') as CollectionReference<MealDB>,
        where('ingredients', 'array-contains', ingredient.id),
      ),
    );
    const batch = writeBatch(firestore);
    batch.delete(doc(firestore, `ingredients/${ingredient.id}`));
    recipes.forEach((recipe) =>
      batch.update(doc(firestore, `recipes/${recipe.id}`) as DocumentReference<RecipeDB>, {
        ingredients: arrayRemove(ingredient.id),
      }),
    );
    snapshot.forEach((_doc) =>
      batch.update(doc(firestore, `meals/${_doc.id}`) as DocumentReference<RecipeDB>, {
        ingredients: arrayRemove(ingredient.id),
      }),
    );
    await batch.commit();
    setIsLoading({ ...isLoading, ingredient: { ...isLoading.ingredient, delete: false } });
    setDeleteIngredient(undefined);
  }

  async function onCreateRecipe() {
    setIsLoading({ ...isLoading, recipe: { ...isLoading.recipe, create: true } });
    const recipe: RecipeDB = {
      ingredients: Array.from(selectedIngredients).map((ingredient) => ingredient.id),
      name: name.trim(),
    };
    await addDoc(collection(firestore, 'recipes') as CollectionReference<RecipeDB>, recipe);
    onDrawerClose();
  }

  async function onUpdateRecipe() {
    if (!recipe) {
      return;
    }
    const newIngredients = Array.from(selectedIngredients);
    const deletedIngredients = recipe.ingredients.reduce<string[]>(
      (prev, ingredient) => (newIngredients.includes(ingredient) ? prev : [...prev, ingredient.id]),
      [],
    );
    const batch = writeBatch(firestore);
    batch.update(doc(firestore, `recipes/${recipe.id}`) as DocumentReference<RecipeDB>, {
      name: name.trim(),
      ingredients: newIngredients.map((ingredient) => ingredient.id),
    });
    if (deletedIngredients.length > 0) {
      const snapshot = await getDocs(
        query(
          collection(firestore, 'meals') as CollectionReference<MealDB>,
          where('ingredients', 'array-contains-any', deletedIngredients),
        ),
      );
      snapshot.forEach((_doc) =>
        batch.update(doc(firestore, `meals/${_doc.id}`) as DocumentReference<RecipeDB>, {
          ingredients: arrayRemove(...deletedIngredients),
        }),
      );
    }
    await batch.commit();
    setIsLoading({ ...isLoading, recipe: { ...isLoading.recipe, update: true } });
    onDrawerClose();
  }

  async function onPromptDeleteRecipe() {
    if (!recipe) {
      return;
    }
    const snapshot = await getDocs(
      query(collection(firestore, 'meals') as CollectionReference<MealDB>, where('recipe', '==', recipe.id)),
    );
    const meals = [
      ...snapshot.docs.map<Meal>((doc) => ({
        ...doc.data(),
        id: doc.id,
        recipe,
        ingredients: doc.data().ingredients.map((ingredient) => ingredients[ingredient]),
        users: doc.data().users.map((user) => users[user]),
      })),
    ].sort((a, b) => (a.day.localeCompare(b.day) || TimeDetails[a.time].order > TimeDetails[b.time].order ? 1 : -1));
    setDeleteRecipe({ meals, recipe });
  }

  async function onDeleteRecipe() {
    if (!deleteRecipe) {
      return;
    }
    const { meals, recipe } = deleteRecipe;
    setIsLoading({ ...isLoading, recipe: { ...isLoading.recipe, delete: true } });
    const batch = writeBatch(firestore);
    batch.delete(doc(firestore, `recipes/${recipe.id}`));
    meals.forEach((meal) => batch.delete(doc(firestore, `meals/${meal.id}`)));
    await batch.commit();
    onDrawerClose();
  }

  const isInvalid = name.trim().length === 0;

  return (
    <Fragment>
      <DeleteIngredientAlert
        ingredientPayload={deleteIngredient}
        isLoading={isLoading.ingredient.delete}
        onClose={() => setDeleteIngredient(undefined)}
        onDelete={onDeleteIngredient}
      />
      <DeleteRecipeAlert
        recipePayload={deleteRecipe}
        isLoading={isLoading.recipe.delete}
        onClose={() => setDeleteRecipe(undefined)}
        onDelete={onDeleteRecipe}
      />
      <Drawer isOpen={isOpen} placement='right' onClose={onDrawerClose} size='xs'>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (recipe) {
                  onUpdateRecipe();
                  return;
                }
                onCreateRecipe();
              }}
            >
              <FormControl isInvalid={isInvalid} px={1} mt={8}>
                <Input autoFocus placeholder='Recipe name...' value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </form>
          </DrawerHeader>
          <DrawerBody>
            <IngredientLists
              ingredients={Object.values(ingredients)}
              selectedIngredients={selectedIngredients}
              onDelete={onPromptDeleteIngredient}
              onUpdate={onUpdateIngredient}
              onSelect={setSelectedIngredients}
            />
          </DrawerBody>
          <DrawerFooter>
            <Flex flexDir='column' gap={2} flex={1}>
              <Box px={1} flex={1}>
                <AddIngredientInput
                  addSelectedIngredient={(ingredient) =>
                    setSelectedIngredients((prev) => new Set(prev).add(ingredient))
                  }
                />
              </Box>
              <ButtonGroup display='flex' justifyContent='flex-end' px={1}>
                {recipe && (
                  <Button isDisabled={isAnyLoading(isLoading)} colorScheme='red' onClick={onPromptDeleteRecipe} ml={3}>
                    Delete
                  </Button>
                )}
                <Button
                  isDisabled={isInvalid || isAnyLoading(isLoading)}
                  isLoading={isLoading.recipe.create || isLoading.recipe.update}
                  colorScheme='blue'
                  onClick={recipe ? onUpdateRecipe : onCreateRecipe}
                >
                  Save
                </Button>
              </ButtonGroup>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}
