import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useDimensions,
} from '@chakra-ui/react';
import { CollectionReference, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Ingredient, IngredientDB } from 'types/ingredient';
import { IoCartOutline, IoLockClosedOutline } from 'react-icons/io5';
import { Meal, MealDB, WeekMeals } from 'types/meal';
import { Recipe, RecipeDB } from 'types/recipe';
import { addDays, getCurrentDays, reverseDash } from 'utils/date';

import { CartDrawer } from 'components/CartDrawer';
import DayColumn from 'components/DayColumn';
import RecipeCard from 'components/RecipeCard';
import RecipeDrawer from 'components/RecipeDrawer';
import { UserDB } from 'types/user';
import { firestore } from '_firebase';
import { setIngredients } from 'store/ingredient';
import { setRecipes } from 'store/recipe';
import { setUsers } from 'store/user';
import { useDispatch } from 'hooks/useDispatch';
import { useSelector } from 'hooks/useSelector';

export default function HomePage(): JSX.Element {
  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const dimensions = useDimensions(elementRef, true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [maxDays, setMaxDays] = useState(7);
  const [currentDays, setCurrentDays] = useState<string[]>([reverseDash(new Date())]);
  const [weekMeals, setWeekMeals] = useState<WeekMeals>({});
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>();

  const { ingredients, fetched: ingredientsFetched } = useSelector((state) => state.ingredientState);
  const { recipes, fetched: recipesFetched } = useSelector((state) => state.recipeState);
  const { users, fetched: usersFetched } = useSelector((state) => state.userState);

  const cartCount = useMemo(() => {
    const uniqueIngredients = meals.reduce<Ingredient[]>((prevA, meal) => {
      return [
        ...prevA,
        ...meal.ingredients.reduce<Ingredient[]>(
          (prevB, ingredient) => (prevA.some((i) => i.id === ingredient.id) ? prevB : [...prevB, ingredient]),
          [],
        ),
      ];
    }, []);
    return uniqueIngredients.length;
  }, [meals]);

  useEffect(() => {
    setCurrentDays((prev) => getCurrentDays(prev[0], maxDays));
  }, [maxDays]);

  useEffect(() => {
    (async function () {
      const unsubscribe = onSnapshot(
        query(collection(firestore, 'users') as CollectionReference<UserDB>),
        (snapshot) => {
          const users = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          dispatch(setUsers({ users }));
        },
      );
      return unsubscribe;
    })();
  }, [dispatch]);

  useEffect(() => {
    (async function () {
      const unsubscribe = onSnapshot(
        query(collection(firestore, 'ingredients') as CollectionReference<IngredientDB>, orderBy('name')),
        (snapshot) => {
          const ingredients = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          dispatch(setIngredients({ ingredients }));
        },
      );
      return unsubscribe;
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!ingredientsFetched) {
      return;
    }
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'recipes') as CollectionReference<RecipeDB>, orderBy('name')),
      (snapshot) => {
        const recipes = snapshot.docs.map<Recipe>((doc) => ({
          id: doc.id,
          ingredients: doc.data().ingredients.map((ingredient) => ingredients[ingredient]),
          name: doc.data().name,
        }));
        dispatch(setRecipes({ recipes }));
      },
    );
    return unsubscribe;
  }, [dispatch, ingredients, ingredientsFetched]);

  useEffect(() => {
    if (currentDays.length === 0 || !recipesFetched || !usersFetched || !ingredientsFetched) {
      return;
    }
    const unsubscribe = onSnapshot<MealDB>(
      query(
        collection(firestore, 'meals') as CollectionReference<MealDB>,
        orderBy('day'),
        where('day', '>=', currentDays[0]),
        where('day', '<=', currentDays[currentDays.length - 1]),
      ),
      (snapshot) => {
        const [meals, weekMeals] = snapshot.docs.reduce<[Meal[], WeekMeals]>(
          (prev, doc) => {
            const meal: Meal = {
              ...doc.data(),
              id: doc.id,
              ingredients: doc.data().ingredients.map((ingredient) => ingredients[ingredient]),
              recipe: recipes[doc.data().recipe],
              users: doc.data().users.map((user) => users[user]),
            };
            const dayMeals = prev[1][meal.day];
            if (!dayMeals) {
              return [[...prev[0], meal], { ...prev[1], [meal.day]: { [meal.time]: [meal] } }];
            }
            const timeMeals = dayMeals[meal.time];
            if (!timeMeals) {
              return [[...prev[0], meal], { ...prev[1], [meal.day]: { ...dayMeals, [meal.time]: [meal] } }];
            }
            return [
              [...prev[0], meal],
              {
                ...prev[1],
                [meal.day]: {
                  ...dayMeals,
                  [meal.time]: [...timeMeals, meal].sort((a, b) => a.recipe.name.localeCompare(b.recipe.name)),
                },
              },
            ];
          },
          [[], {}],
        );
        setMeals(meals);
        setWeekMeals(weekMeals);
      },
    );
    return unsubscribe;
  }, [currentDays, ingredients, ingredientsFetched, recipes, recipesFetched, users, usersFetched]);

  const width = (dimensions?.borderBox.width ?? 0) / maxDays;

  return (
    <Flex maxW='full'>
      <Box w='85vw' p={2}>
        <Flex align='center' justify='space-between' px={4}>
          <Flex align='center' pb={2} gap={2}>
            <Heading>🍽️</Heading>
            <IconButton
              aria-label='previous-week'
              icon={<ChevronLeftIcon boxSize='1.5rem' />}
              isRound
              variant='ghost'
              colorScheme='blue'
              onClick={() => setCurrentDays(addDays(currentDays, -maxDays))}
              _focus={{ boxShadow: 'none' }}
            />
            <Button
              rounded='full'
              colorScheme='blue'
              variant='link'
              onClick={() => setCurrentDays(getCurrentDays(new Date(), maxDays))}
              _focus={{ boxShadow: 'none' }}
            >
              Today
            </Button>
            <IconButton
              aria-label='next-week'
              icon={<ChevronRightIcon boxSize='1.5rem' />}
              isRound
              variant='ghost'
              colorScheme='blue'
              onClick={() => setCurrentDays(addDays(currentDays, maxDays))}
              _focus={{ boxShadow: 'none' }}
            />
          </Flex>
          <Flex align='center' gap={4}>
            <Text>{`${maxDays} day${maxDays > 1 ? 's' : ''}`}</Text>
            <Slider w='36' step={1} min={1} max={10} value={maxDays} onChange={(value) => setMaxDays(value)}>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb shadow='dark-lg' />
            </Slider>
          </Flex>
        </Flex>
        <Flex ref={elementRef} borderWidth={1} borderRadius='lg' overflow='hidden'>
          {currentDays.map((day, index, array) => (
            <DayColumn
              key={day}
              meals={weekMeals[day]}
              day={day}
              isLast={index === array.length - 1}
              onClick={() => setCurrentDays(getCurrentDays(day, maxDays))}
              width={width}
            />
          ))}
        </Flex>
      </Box>
      <Box p={2} pl={2} w='14vw' h='102vh' overflowY='auto' pos='fixed' top={0} right={0} boxShadow='md'>
        <Flex alignItems='center' justify='flex-end' gap={2}>
          <Tooltip label='Add new recipe'>
            <IconButton
              aria-label='edit-icon'
              size='sm'
              isRound
              colorScheme='blue'
              icon={<AddIcon />}
              onClick={() => setIsRecipeOpen(true)}
            />
          </Tooltip>
          <Tooltip label='View shopping cart'>
            <IconButton
              aria-label='cart-icon'
              size='sm'
              isRound
              colorScheme='blue'
              icon={
                <Fragment>
                  <Icon as={IoCartOutline} boxSize='1.1rem' />
                  {cartCount > 0 && (
                    <Badge pos='absolute' top='4' right='-2' colorScheme='red' rounded='full' zIndex={2}>
                      {cartCount}
                    </Badge>
                  )}
                </Fragment>
              }
              onClick={() => setIsCartOpen(true)}
            />
          </Tooltip>
          <Tooltip label='Sign out'>
            <IconButton
              aria-label='lock-icon'
              size='sm'
              isRound
              colorScheme='blue'
              icon={<Icon as={IoLockClosedOutline} boxSize='1.05rem' />}
            />
          </Tooltip>
        </Flex>
        <Box>
          {Object.values(recipes).map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => {
                setSelectedRecipe(recipe);
                setIsRecipeOpen(true);
              }}
            />
          ))}
        </Box>
      </Box>
      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={isRecipeOpen}
        onClose={() => {
          setSelectedRecipe(undefined);
          setIsRecipeOpen(false);
        }}
      />
      <CartDrawer isOpen={isCartOpen} meals={meals} onClose={() => setIsCartOpen(false)} />
    </Flex>
  );
}
