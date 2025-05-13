import { Item } from "@/types"
import { create } from "zustand"

interface CollectionState {
  selectedCollectionId: string
  setSelectedCollectionId: (id: string) => void

  searchQuery: string
  setSearchQuery: (query: string) => void

  bulkEditColumn: string | null
  setBulkEditColumn: (column: string | null) => void

  bulkEditValue: any
  setBulkEditValue: (value: any) => void

  currentPage: number
  setCurrentPage: (page: number) => void

  pageSize: number
  setPageSize: (size: number) => void

  sortKey: string | null
  setSortKey: (key: string | null) => void

  sortOrder: "asc" | "desc"
  setSortOrder: (order: "asc" | "desc") => void

  lastUpdatedFilter: string
  setLastUpdatedFilter: (filter: string) => void


  selectedIds: string[]
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void

  editedItems: Record<string, Record<string, any>>
  setEditedItems: (
    items:
      | Record<string, Record<string, any>>
      | ((prev: Record<string, Record<string, any>>) => Record<string, Record<string, any>>),
  ) => void

  newItems: Record<string, Record<string, any>>
  setNewItems: (
    items:
      | Record<string, Record<string, any>>
      | ((prev: Record<string, Record<string, any>>) => Record<string, Record<string, any>>),
  ) => void

  referenceCollections: Record<string, Item[]>
  setReferenceCollections: (
    collections: Record<string, Item[]> | ((prev: Record<string, Item[]>) => Record<string, Item[]>),
  ) => void
}

export const useStore = create<CollectionState>((set) => ({
  selectedCollectionId: "",
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  bulkEditColumn: null,
  setBulkEditColumn: (column) => set({ bulkEditColumn: column }),

  bulkEditValue: "",
  setBulkEditValue: (value) => set({ bulkEditValue: value }),

  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),

  pageSize: 15,
  setPageSize: (size) => set({ pageSize: size }),

  sortKey: null,
  setSortKey: (key) => set({ sortKey: key }),

  sortOrder: "asc",
  setSortOrder: (order) => set({ sortOrder: order }),

  lastUpdatedFilter: "all",
  setLastUpdatedFilter: (filter) => set({ lastUpdatedFilter: filter }),


  selectedIds: [],
  setSelectedIds: (ids) =>
    set((state) => ({
      selectedIds: typeof ids === "function" ? ids(state.selectedIds) : ids,
    })),

  editedItems: {},
  setEditedItems: (items) =>
    set((state) => ({
      editedItems: typeof items === "function" ? items(state.editedItems) : items,
    })),

  newItems: {},
  setNewItems: (items) =>
    set((state) => ({
      newItems: typeof items === "function" ? items(state.newItems) : items,
    })),

  referenceCollections: {},
  setReferenceCollections: (collections) =>
    set((state) => ({
      referenceCollections: typeof collections === "function" ? collections(state.referenceCollections) : collections,
    })),
}))
