export type IsLoading = {
  [domain: string]: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
};
