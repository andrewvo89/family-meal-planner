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

import { Props } from 'components/DeleteIngredientAlert/types';

export default function DeleteIngredientAlert(props: Props): JSX.Element | null {
  const { ingredientPayload, isLoading, onClose, onDelete } = props;
  const cancelRef = useRef(null);

  if (!ingredientPayload) {
    return null;
  }

  function onModalClose(): void {
    if (isLoading) {
      return;
    }
    onClose();
  }

  const { ingredient, recipes } = ingredientPayload;

  return (
    <Fragment>
      <AlertDialog isOpen={!!ingredientPayload} leastDestructiveRef={cancelRef} onClose={onModalClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Ingredient
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack spacing={2}>
                <Text>{`Are you sure you want to delete ${ingredient.name}?${
                  recipes.length > 0 ? ' It will be removed from the following recipes:' : ''
                }`}</Text>
                <Box>
                  {recipes.map((recipe) => (
                    <Text key={recipe.id}>{`• ${recipe.name}`}</Text>
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
