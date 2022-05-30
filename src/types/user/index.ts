export type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export type UserDB = Omit<User, 'id'>;
