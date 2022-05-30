import { User } from 'types/user';

export type UserState = {
  fetched: boolean;
  users: {
    [id: string]: User;
  };
};

export type SetUserPayload = {
  users: User[];
};
