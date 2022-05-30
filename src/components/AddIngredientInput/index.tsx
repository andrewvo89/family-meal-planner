import { CollectionReference, addDoc, collection } from 'firebase/firestore';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { Input, useToast } from '@chakra-ui/react';

import { IngredientDB } from 'types/ingredient';
import { Props } from 'components/AddIngredientInput/types';
import { firestore } from '_firebase';
import { useSelector } from 'hooks/useSelector';

export default function AddIngredientInput(props: Props): JSX.Element {
  const { addSelectedIngredient } = props;
  const toast = useToast();

  const [value, setValue] = useState('');
  const ingredients = useSelector((state) => state.ingredientState.ingredients);
  const ingredientsRef = useRef<typeof ingredients>({});

  useEffect(() => {
    ingredientsRef.current = ingredients;
  }, [ingredients]);

  async function onCreateIngredient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = value.trim();
    const exists = Object.values(ingredients).find(
      (ingredients) => ingredients.name.toLowerCase() === name.toLowerCase(),
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
    const docRef = await addDoc(collection(firestore, 'ingredients') as CollectionReference<IngredientDB>, { name });
    setValue('');
    for (let x = 0; x < 5; x++) {
      const ingredient = ingredientsRef.current[docRef.id];
      if (ingredient) {
        addSelectedIngredient(ingredient);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return (
    <form onSubmit={onCreateIngredient}>
      <Input placeholder='Create new ingredient...' value={value} onChange={(e) => setValue(e.target.value)} />
    </form>
  );
}
