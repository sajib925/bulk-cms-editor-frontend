
export type Collection = {
  id: string;
  displayName: string;
  slug: string;
};

export type FieldData = {
  [key: string]: string | undefined; 
};

export type CollectionItem = {
  id: string;
  fieldData: FieldData;
};