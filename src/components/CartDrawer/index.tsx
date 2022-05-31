import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { CartItem, Props, RecipeQuantity } from 'components/CartDrawer/types';
import { useEffect, useMemo, useState } from 'react';

import { CopyIcon } from '@chakra-ui/icons';
import { Ingredient } from 'types/ingredient';
import { TimeDetails } from 'types/day';
import { dayName } from 'utils/date';
import { sortWithEmoji } from 'utils/common';

export function CartDrawer(props: Props): JSX.Element | null {
  const toast = useToast();
  const { isOpen, onClose, meals } = props;

  const [cart, setCart] = useState<CartItem[]>([]);

  const totalQuantity = useMemo(() => cart.reduce<number>((prev, item) => prev + item.quantity, 0), [cart]);

  useEffect(() => {
    setCart((prevCart) => {
      const uniqueIngredients = meals
        .reduce<Ingredient[]>((prevA, meal) => {
          return [
            ...prevA,
            ...meal.ingredients.reduce<Ingredient[]>(
              (prevB, ingredient) => (prevA.some((i) => i.id === ingredient.id) ? prevB : [...prevB, ingredient]),
              [],
            ),
          ];
        }, [])
        .sort((a, b) => sortWithEmoji(a.name, b.name));
      return uniqueIngredients.map((ingredient) => {
        const exists = prevCart.find((item) => item.ingredient === ingredient);
        const recipes = meals
          .reduce<RecipeQuantity[]>((prev, meal) => {
            const recipeHasIngredient = meal.recipe.ingredients.some((i) => i === ingredient);
            if (!recipeHasIngredient) {
              return prev;
            }
            const exists = prev.find((recipe) => recipe.recipe === meal.recipe);
            if (!exists) {
              return [...prev, { recipe: meal.recipe, meals: [meal] }];
            }
            return prev.map((recipe) => {
              if (recipe.recipe !== meal.recipe) {
                return recipe;
              }
              const recipeMeals = [...recipe.meals, meal].sort((a, b) =>
                a.day.localeCompare(b.day) || TimeDetails[a.time].order > TimeDetails[b.time].order ? 1 : -1,
              );
              return { ...recipe, meals: recipeMeals };
            });
          }, [])
          .sort((a, b) => sortWithEmoji(a.recipe.name, b.recipe.name));
        return { ingredient, recipes, quantity: exists ? exists.quantity : 1 };
      });
    });
  }, [meals]);

  async function onCopyCart() {
    const text = cart
      .reduce<string[]>(
        (prev, item) => (item.quantity === 0 ? prev : [...prev, `${item.quantity}x ${item.ingredient.name}`]),
        [],
      )
      .join('\n');
    await navigator.clipboard.writeText(text);
    toast({
      title: 'Clipboard Copy',
      description: 'Shopping list successfully copied to the clipboard',
      position: 'top',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  }

  function onQuantityChange(ingredient: Ingredient, quantity: number) {
    const safeQuantity = isNaN(quantity) ? 0 : quantity;
    setCart((prevCart) =>
      prevCart.map((item) => (item.ingredient === ingredient ? { ...item, quantity: safeQuantity } : item)),
    );
  }

  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} size='xs'>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Shopping Cart</DrawerHeader>
        <DrawerBody>
          <Stack spacing={6}>
            {cart.length === 0 && (
              <Text fontSize='sm' color='gray.500'>
                Your shopping cart is empty...
              </Text>
            )}
            {cart.map((item) => (
              <Flex flexDir='column' key={item.ingredient.id} gap={2}>
                <Flex gap={2} align='center'>
                  <Box flex={0.3}>
                    <NumberInput
                      size='md'
                      maxW={24}
                      value={item.quantity}
                      onChange={(_, value) => onQuantityChange(item.ingredient, value)}
                      min={0}
                      step={0.5}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Box>
                  <Box flex={0.7}>
                    <Text>{item.ingredient.name}</Text>
                  </Box>
                </Flex>
                <Flex gap={1} flexWrap='wrap'>
                  {item.recipes.map((recipe) => (
                    <Tooltip
                      key={recipe.recipe.id}
                      label={recipe.meals.map((meal) => (
                        <Text key={meal.id}>{`${dayName(meal.day)} ${TimeDetails[meal.time].name}`}</Text>
                      ))}
                    >
                      <Tag borderRadius='full'>
                        <TagLabel>{`${recipe.meals.length}x ${recipe.recipe.name}`}</TagLabel>
                      </Tag>
                    </Tooltip>
                  ))}
                </Flex>
              </Flex>
            ))}
          </Stack>
        </DrawerBody>
        <DrawerFooter>
          <Button colorScheme='blue' leftIcon={<CopyIcon />} isDisabled={totalQuantity === 0} onClick={onCopyCart}>
            Copy
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
