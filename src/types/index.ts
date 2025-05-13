export type FieldData = {
  [key: string]: string | undefined; 
};

export type CollectionItem = {
  id: string;
  fieldData: FieldData;
};

export interface Collection {
  id: string
  displayName: string
}

export interface Item {
  id: string
  fieldData: Record<string, any>
}

export interface ExtendedItem extends Item {
  lastUpdated?: string
  createdOn?: string
}

export type FieldType =
  | "PlainText"
  | "RichText"
  | "ImageRef"
  | "ImageRefSet"
  | "VideoLink"
  | "Link"
  | "Email"
  | "Phone"
  | "Number"
  | "DateTime"
  | "Switch"
  | "Color"
  | "Option"
  | "File"
  | "Reference"
  | "MultiReference"
  | "Set"
  | "User"

export interface FieldDefinition {
  id: string
  isEditable: boolean
  isRequired: boolean
  type: FieldType
  slug: string
  displayName: string
  validations: any
}

export interface UpdatePayload {
  items: Array<{ _id: string; fields: Record<string, any> }>
}
