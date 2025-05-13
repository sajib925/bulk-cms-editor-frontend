import { Collection, FieldDefinition, Item } from '@/types';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/cms', 
});

export default api;




interface UpdatePayload {
  items: Array<{ _id: string; fields: Record<string, string> }>;
}

// Fetch collections
export const fetchCollections = async (): Promise<Collection[]> => {
  const res = await api.get("/collections")
  return res.data.collections
}

// Fetch collection schema
export const fetchCollectionSchema = async (collectionId: string): Promise<FieldDefinition[]> => {
  const res = await api.get(`/collections/${collectionId}`)
  return res.data.detailsCmsCollection.fields || []
}

// Fetch items
export const fetchItems = async (collectionId: string): Promise<Item[]> => {
  const res = await api.get(`/collections/${collectionId}/items`)
  return res.data.collectionItems.items
}

// Update items
export const updateItems = async (collectionId: string, payload: UpdatePayload): Promise<Item[]> => {
  const res = await api.patch(`/collections/${collectionId}/items`, payload)
  return res.data
}

// Delete items
export const deleteItems = async (collectionId: string, ids: string[]): Promise<void> => {
  await Promise.all(ids.map((id) => api.delete(`/collections/${collectionId}/items/${id}`)))
}

// import axios from "axios"
// import type { Collection, Item, UpdatePayload } from "@/lib/types"

// // const api = axios.create({
// //   baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
// // })

// const api = axios.create({
//   baseURL: 'http://localhost:3001/api/cms', 
// });

// // Fetch collections
// export const fetchCollections = async (): Promise<Collection[]> => {
//   const res = await api.get("/collections")
//   return res.data.collections
// }

// // Fetch collection schema
// export const fetchCollectionSchema = async (collectionId: string) => {
//   const res = await api.get(`/collections/${collectionId}`)
//   return res.data.detailsCmsCollection.fields || []
// }

// // Fetch items
// export const fetchItems = async (collectionId: string): Promise<Item[]> => {
//   const res = await api.get(`/collections/${collectionId}/items`)
//   return res.data.collectionItems.items
// }

// // Update items
// export const updateItems = async (collectionId: string, payload: UpdatePayload): Promise<Item[]> => {
//   const res = await api.patch(`/collections/${collectionId}/items`, payload)
//   return res.data
// }

// // Delete items
// export const deleteItems = async (collectionId: string, ids: string[]): Promise<void> => {
//   await Promise.all(ids.map((id) => api.delete(`/collections/${collectionId}/items/${id}`)))
// }

// export default api