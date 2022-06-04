import { CollectionReference, WithFieldValue, addDoc, collection } from 'firebase/firestore';
import { DnDCardType, RecipeCardCollectResult, TimeSectionDropResult } from 'types/dnd';
import { Flex, Text, Tooltip } from '@chakra-ui/react';

import { MealDB } from 'types/meal';
import { Props } from 'components/RecipeCard/types';
import { Recipe } from 'types/recipe';
import { firestore } from '_firebase';
import { useDrag } from 'react-dnd';

export default function RecipeCard(props: Props): JSX.Element {
  const { recipe, onClick } = props;

  const [{ isDragging }, dragRef] = useDrag<Recipe, TimeSectionDropResult, RecipeCardCollectResult>(
    () => ({
      type: DnDCardType.RECIPE_CARD,
      item: recipe,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      options: { dropEffect: 'copy' },
      end: (recipe, monitor) => {
        const dropResult = monitor.getDropResult();
        if (!dropResult) {
          return;
        }
        onCreateMeal({
          day: dropResult.day,
          time: dropResult.time,
          ingredients: recipe.ingredients.map((ingredient) => ingredient.id),
          notes: '',
          recipe: recipe.id,
          users: [],
        });
      },
    }),
    [recipe.id],
  );

  async function onCreateMeal(params: WithFieldValue<MealDB>) {
    await addDoc(collection(firestore, 'meals') as CollectionReference<MealDB>, params);
  }

  return (
    <div onClick={onClick}>
      <Flex
        ref={dragRef}
        key={recipe.id}
        p={2}
        m={2}
        borderWidth={isDragging ? 0 : 1}
        borderRadius='lg'
        boxShadow='md'
        opacity={isDragging ? 0 : 1}
        _hover={{ cursor: 'pointer' }}
        justifyContent='space-between'
        alignItems='center'
      >
        {recipe.ingredients.length > 0 ? (
          <Tooltip
            label={recipe.ingredients.map((ingredient) => (
              <Text key={ingredient.id}>{ingredient.name}</Text>
            ))}
          >
            <Text>{recipe.name}</Text>
          </Tooltip>
        ) : (
          <Text>{recipe.name}</Text>
        )}
      </Flex>
    </div>
  );
}
