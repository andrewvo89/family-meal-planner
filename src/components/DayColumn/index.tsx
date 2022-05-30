import { Flex, Link } from '@chakra-ui/react';
import { reverseDash, shortDate } from 'utils/date';

import { Props } from 'components/DayColumn/types';
import { Time } from 'types/day';
import { TimeSection } from 'components/TimeSection';

export default function DayColumn(props: Props): JSX.Element {
  const { day, meals = {}, isLast, width, onClick } = props;

  return (
    <Flex
      flexDir='column'
      maxW={width}
      flexGrow={1}
      borderWidth={`0 ${isLast ? '0' : '1px'} 0 0`}
      backgroundColor={day === reverseDash(new Date()) ? 'gray.50' : undefined}
    >
      <Flex justify='center' p={1}>
        <Link fontWeight='bold' onClick={onClick}>
          {shortDate(day)}
        </Link>
      </Flex>
      {Object.values(Time).map((time) => (
        <TimeSection key={time} day={day} meals={meals[time]} time={time} />
      ))}
    </Flex>
  );
}
