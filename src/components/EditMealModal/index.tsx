import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { Props } from 'components/EditMealModal/types';
import { TimeDetails } from 'types/day';
import { dayName } from 'utils/date';
import { sortWithEmoji } from 'utils/common';
import { useSelector } from 'hooks/useSelector';

export default function EditMealModal(props: Props): JSX.Element {
  const { meal, isOpen, onClose, onSave } = props;

  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sortedUsers = useSelector((state) =>
    Object.values(state.userState.users).sort((a, b) => a.firstName.localeCompare(b.firstName)),
  );

  const sortedIngredients = useMemo(
    () => [...meal.recipe.ingredients].sort((a, b) => sortWithEmoji(a.name, b.name)),
    [meal],
  );

  useEffect(() => {
    setNotes(meal.notes);
    setSelectedIngredients(new Set(meal.ingredients.map((ingredient) => ingredient.id)));
    setSelectedUsers(new Set(meal.users.map((user) => user.id)));
  }, [meal]);

  async function onSaveMeal() {
    setIsLoading(true);
    await onSave(selectedUsers, selectedIngredients, notes.trim());
    setIsLoading(false);
    onClose();
  }

  const allUsersChecked = selectedUsers.size === sortedUsers.length;
  const someUsersChecked = !allUsersChecked && selectedUsers.size > 0;

  const allIngredientsChecked = selectedIngredients.size === meal.recipe.ingredients.length;
  const someIngredientsChecked = !allIngredientsChecked && selectedIngredients.size > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${meal.recipe.name} (${dayName(meal.day)} ${TimeDetails[meal.time].name})`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {sortedUsers.length > 0 && (
              <FormControl>
                <FormLabel>Users</FormLabel>
                <CheckboxGroup
                  value={Array.from(selectedUsers)}
                  onChange={(value) => setSelectedUsers(new Set(value.map((v) => v.toString())))}
                >
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={allUsersChecked}
                      isIndeterminate={someUsersChecked}
                      onChange={() => {
                        if (allUsersChecked) {
                          setSelectedUsers(new Set());
                          return;
                        }
                        setSelectedUsers(new Set(sortedUsers.map((user) => user.id)));
                      }}
                    >
                      Select all
                    </Checkbox>
                    {sortedUsers.map((user) => (
                      <Checkbox key={user.id} pl={6} value={user.id}>{`${user.firstName} ${user.lastName}`}</Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>
            )}
            {sortedIngredients.length > 0 && (
              <FormControl>
                <FormLabel>Ingredients</FormLabel>
                <CheckboxGroup
                  value={Array.from(selectedIngredients)}
                  onChange={(value) => setSelectedIngredients(new Set(value.map((v) => v.toString())))}
                >
                  <Stack spacing={2}>
                    <Checkbox
                      isChecked={allIngredientsChecked}
                      isIndeterminate={someIngredientsChecked}
                      onChange={() => {
                        if (allIngredientsChecked) {
                          setSelectedIngredients(new Set());
                          return;
                        }
                        setSelectedIngredients(new Set(sortedIngredients.map((ingredient) => ingredient.id)));
                      }}
                    >
                      Select all
                    </Checkbox>
                    {sortedIngredients.map((ingredient) => (
                      <Checkbox key={ingredient.id} pl={6} value={ingredient.id}>
                        {ingredient.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} autoFocus resize='none' />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup display='flex' justifyContent='flex-end' px={1}>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button isDisabled={isLoading} isLoading={isLoading} colorScheme='blue' onClick={onSaveMeal}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
