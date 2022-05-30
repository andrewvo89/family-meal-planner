import { BackgroundProps, Flex, Text } from '@chakra-ui/react';
import { DnDCardType, TimeSectionCollectResult, TimeSectionDropResult } from 'types/dnd';

import { Meal } from 'types/meal';
import MealCard from 'components/MealCard';
import { Props } from 'components/TimeSection/types';
import { Recipe } from 'types/recipe';
import { TimeDetails } from 'types/day';
import { reverseDash } from 'utils/date';
import { useDrop } from 'react-dnd';

export function TimeSection(props: Props): JSX.Element {
  const { day, meals = [], time } = props;

  const [{ isOver }, drop] = useDrop<Recipe | Meal, TimeSectionDropResult, TimeSectionCollectResult>(
    () => ({
      accept: Object.values(DnDCardType),
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
        };
      },
      drop: () => ({ day, time }),
    }),
    [day, time],
  );

  let backgroundColor: BackgroundProps['backgroundColor'];
  if (day === reverseDash(new Date())) {
    backgroundColor = 'gray.50';
  }
  if (isOver) {
    backgroundColor = 'gray.200';
  }

  return (
    <Flex
      ref={drop}
      h='35vh'
      flexDir='column'
      p={2}
      gap={2}
      backgroundColor={backgroundColor}
      overflowY='auto'
      borderWidth={'1px 0 0 0'}
    >
      <Text fontWeight='semibold' color='gray.500'>
        {TimeDetails[time].name}
      </Text>
      {meals.map((meal, index) => (
        <MealCard key={index} meal={meal} />
      ))}
    </Flex>
  );
}
