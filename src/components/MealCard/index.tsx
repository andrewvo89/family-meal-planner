import { Avatar, Box, CloseButton, Flex, Tag, TagLabel, Text, Tooltip } from '@chakra-ui/react';
import {
  CollectionReference,
  DocumentReference,
  UpdateData,
  WithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { DnDCardType, MealCardCollectResult, TimeSectionDropResult } from 'types/dnd';
import { Fragment, useState } from 'react';
import { Meal, MealDB } from 'types/meal';

import EditMealModal from 'components/EditMealModal';
import { Props } from 'components/MealCard/types';
import { firestore } from '_firebase';
import { useDrag } from 'react-dnd';

export default function MealCard(props: Props): JSX.Element {
  const { meal } = props;
  const [isOpen, setIsOpen] = useState(false);

  const [{ isDragging }, dragRef] = useDrag<Meal, TimeSectionDropResult, MealCardCollectResult>(
    () => ({
      type: DnDCardType.MEAL_CARD,
      item: meal,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      end: async (meal, monitor) => {
        const dropResult = monitor.getDropResult();
        if (!dropResult || (meal.day === dropResult.day && meal.time === dropResult.time)) {
          return;
        }
        if (dropResult.dropEffect === 'move') {
          await onUpdateMeal({ day: dropResult.day, time: dropResult.time });
          return;
        }
        if (dropResult.dropEffect === 'copy') {
          await onCreateMeal({
            day: dropResult.day,
            time: dropResult.time,
            ingredients: meal.ingredients.map((ingredient) => ingredient.id),
            notes: '',
            recipe: meal.recipe.id,
            users: meal.users.map((user) => user.id),
          });
          return;
        }
      },
    }),
    [meal.id],
  );

  async function onCreateMeal(params: WithFieldValue<MealDB>) {
    await addDoc(collection(firestore, 'meals') as CollectionReference<MealDB>, params);
  }

  async function onUpdateMeal(params: UpdateData<MealDB>) {
    await updateDoc(doc(firestore, `meals/${meal.id}`) as DocumentReference<MealDB>, params);
  }

  async function onDeleteMeal() {
    await deleteDoc(doc(firestore, `meals/${meal.id}`));
  }

  return (
    <Fragment>
      <EditMealModal
        meal={meal}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={(users, ingredients, notes) =>
          onUpdateMeal({ ingredients: Array.from(ingredients), notes, users: Array.from(users) })
        }
      />
      <Flex
        ref={dragRef}
        key={meal.id}
        p={2}
        backgroundColor='white'
        borderWidth={isDragging ? 0 : 1}
        borderRadius='lg'
        boxShadow='md'
        opacity={isDragging ? 0 : 1}
        _hover={{ cursor: 'pointer' }}
        justifyContent='space-between'
        onClick={() => setIsOpen(true)}
      >
        <Flex flexDir='column' align='flex-start' gap={2}>
          <Box>
            {meal.ingredients.length > 0 ? (
              <Tooltip
                label={meal.ingredients.map((ingredient) => (
                  <Text key={ingredient.id}>{ingredient.name}</Text>
                ))}
              >
                <Text>{meal.recipe.name}</Text>
              </Tooltip>
            ) : (
              <Text>{meal.recipe.name}</Text>
            )}
            {meal.notes &&
              meal.notes.split('\n').map((line, index) => (
                <Text key={index} fontSize='sm' color='gray.500'>
                  {line}
                </Text>
              ))}
          </Box>
          {meal.users.map((user) => (
            <Tag key={user.id} borderRadius='full'>
              <Avatar size='2xs' name={`${user.firstName} ${user.lastName}`} ml={-1} mr={2} />
              <TagLabel>{user.firstName}</TagLabel>
            </Tag>
          ))}
        </Flex>
        <CloseButton
          id='close-button'
          onClick={(event) => {
            event.stopPropagation();
            onDeleteMeal();
          }}
        />
      </Flex>
    </Fragment>
  );
}
