/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Checkbox, Divider, Flex, Heading, IconButton, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { FormEvent, useMemo, useState } from 'react';

import { Ingredient } from 'types/ingredient';
import { Props } from 'components/IngredientLists/types';
import { sortWithEmoji } from 'utils/common';

export default function IngredientLists(props: Props): JSX.Element {
  const toast = useToast();

  const { ingredients, selectedIngredients, onDelete, onUpdate, onSelect } = props;

  const availableIngredients = useMemo(
    () =>
      ingredients
        .filter((ingredient) => !selectedIngredients.has(ingredient))
        .sort((a, b) => sortWithEmoji(a.name, b.name)),
    [ingredients, selectedIngredients],
  );

  const sortedSelectedIngredients = useMemo(
    () => Array.from(selectedIngredients).sort((a, b) => sortWithEmoji(a.name, b.name)),
    [selectedIngredients],
  );

  const [updateIngedientId, setUpdateIngedientId] = useState<string>();
  const [name, setName] = useState('');

  function onPromptUpdateIngredient(ingredient: Ingredient) {
    setUpdateIngedientId(ingredient.id);
    setName(ingredient.name);
  }

  function onCancelUpdateIngredient() {
    setUpdateIngedientId(undefined);
    setName('');
  }

  async function onUpdateIngredient(id: string, event?: FormEvent<HTMLFormElement>) {
    if (event) {
      event.preventDefault();
    }
    const exists = ingredients.find(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase() && ingredient.id !== id,
    );
    if (exists) {
      toast({
        title: 'Ingredient Exists',
        description: `${exists.name} already exists`,
        position: 'top',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    await onUpdate(id, name.trim());
    onCancelUpdateIngredient();
  }

  function onSelectIngredient(ingredient: Ingredient) {
    onSelect(new Set(selectedIngredients).add(ingredient));
  }

  function onDeselectIngredient(ingredient: Ingredient) {
    const newSelectedIngredients = new Set(selectedIngredients);
    newSelectedIngredients.delete(ingredient);
    onSelect(newSelectedIngredients);
  }

  return (
    <Stack h='100%' justify='space-evenly' spacing={2}>
      <Stack h='50%'>
        <Heading fontSize='md'>Selected Ingredients</Heading>
        <Stack spacing={4} overflowY='auto' px={1}>
          {sortedSelectedIngredients.length === 0 && (
            <Text fontSize='sm' color='gray.500'>
              Ingredients list is empty. Add an ingredient from below...
            </Text>
          )}
          {sortedSelectedIngredients.map((ingredient) => (
            <Checkbox key={ingredient.id} defaultChecked={true} onChange={() => onDeselectIngredient(ingredient)}>
              {ingredient.name}
            </Checkbox>
          ))}
        </Stack>
      </Stack>
      <Divider />
      <Stack h='50%'>
        <Heading fontSize='md'>Available Ingredients</Heading>
        <Stack spacing={1} overflowY='auto' px={1}>
          {availableIngredients.length === 0 && (
            <Text fontSize='sm' color='gray.500'>
              Ingredients list is empty. Create a new ingredient below...
            </Text>
          )}
          {availableIngredients.map((ingredient) =>
            updateIngedientId === ingredient.id ? (
              <Flex key={ingredient.id} justify='space-between' alignItems='center'>
                <form onSubmit={(event) => onUpdateIngredient(ingredient.id, event)}>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </form>
                <Flex alignItems='center'>
                  <IconButton
                    aria-label='cancel-ingredient'
                    icon={<CloseIcon />}
                    isRound
                    variant='ghost'
                    onClick={onCancelUpdateIngredient}
                  />
                  <IconButton
                    aria-label='save-ingredient'
                    icon={<CheckIcon />}
                    isRound
                    variant='ghost'
                    onClick={() => onUpdateIngredient(ingredient.id)}
                  />
                </Flex>
              </Flex>
            ) : (
              <Flex key={ingredient.id} justify='space-between' alignItems='center'>
                <Checkbox defaultChecked={false} onChange={() => onSelectIngredient(ingredient)}>
                  {ingredient.name}
                </Checkbox>
                <Flex alignItems='center'>
                  <IconButton
                    aria-label='update-ingredient'
                    icon={<EditIcon />}
                    isRound
                    variant='ghost'
                    onClick={() => onPromptUpdateIngredient(ingredient)}
                  />
                  <IconButton
                    aria-label='delete-ingredient'
                    icon={<DeleteIcon />}
                    isRound
                    variant='ghost'
                    onClick={() => onDelete(ingredient)}
                  />
                </Flex>
              </Flex>
            ),
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
