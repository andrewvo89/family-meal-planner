import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Fragment, useRef } from 'react';

import { Props } from 'components/DeleteRecipeAlert/types';
import { TimeDetails } from 'types/day';
import { shortDate } from 'utils/date';

export default function DeleteRecipeAlert(props: Props): JSX.Element | null {
  const { recipePayload, isLoading, onClose, onDelete } = props;
  const cancelRef = useRef(null);

  if (!recipePayload) {
    return null;
  }

  function onModalClose(): void {
    if (isLoading) {
      return;
    }
    onClose();
  }

  const { meals, recipe } = recipePayload;

  return (
    <Fragment>
      <AlertDialog isOpen={!!recipePayload} leastDestructiveRef={cancelRef} onClose={onModalClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Ingredient
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack spacing={2}>
                <Text>{`Are you sure you want to delete ${recipe.name}? ${
                  meals.length > 0 ? 'It will be removed from the following time slots:' : ''
                }`}</Text>
                <Box>
                  {meals.map((meal) => (
                    <Text key={meal.id}>{`• ${shortDate(meal.day)} ${TimeDetails[meal.time].name}`}</Text>
                  ))}
                </Box>
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onModalClose} isDisabled={isLoading}>
                Cancel
              </Button>
              <Button isLoading={isLoading} colorScheme='red' onClick={onDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Fragment>
  );
}
