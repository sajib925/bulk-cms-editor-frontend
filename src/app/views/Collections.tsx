import { useMemo, useEffect } from "react"
import { useQuery, useMutation } from "react-query"
import { toast } from "react-toastify"
import api, { deleteItems, fetchCollections, fetchCollectionSchema, fetchItems, updateItems } from "@/lib/api"
import { X, Calendar, LinkIcon, Mail, Phone, Hash, Check, FileText, ImageIcon, Video, Palette } from "lucide-react"
import { useStore } from "@/store/useCollectionStore"
import CollectionSelector from "@/components/collection/CollectionSelector"
import TableHeader from "@/components/collection/TableHeader"
import Pagination from "@/components/collection/Pagination"
import ActionButtons from "@/components/collection/ActionButtons"
import BulkEditField from "@/components/collection/BulkEditField"
import RenderFieldInput from "@/components/collection/RenderFieldInput"
import { Checkbox } from "@/components/ui/checkbox"
import { cleanEmptyFields, generateSlug } from "@/lib/helper"
import { ExtendedItem, FieldDefinition } from "@/types"



export default function Collections() {
  const {
    searchQuery,
    setSearchQuery,
    bulkEditColumn,
    bulkEditValue,
    currentPage,
    editedItems,
    newItems,
    pageSize,
    referenceCollections,
    selectedCollectionId,
    selectedIds,
    setBulkEditColumn,
    setBulkEditValue,
    setCurrentPage,
    setEditedItems,
    setNewItems,
    setPageSize,
    setReferenceCollections,
    setSelectedCollectionId,
    setSelectedIds,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder,
    lastUpdatedFilter, 
    setLastUpdatedFilter
  } = useStore()

  const { data: collections = [] } = useQuery("collections", fetchCollections)

  const { data: collectionSchema = [] } = useQuery<FieldDefinition[], Error>(
    ["collectionSchema", selectedCollectionId],
    () => fetchCollectionSchema(selectedCollectionId),
    {
      enabled: !!selectedCollectionId,
    },
  )

  const { data: items = [], refetch: refetchItems } = useQuery<ExtendedItem[], Error>(
    ["items", selectedCollectionId],
    () => fetchItems(selectedCollectionId),
    {
      enabled: !!selectedCollectionId,
    },
  )

  

  const referenceFields = useMemo(() => {
    return collectionSchema
      .filter((field) => field.type === "Reference" || field.type === "MultiReference")
      .map((field) => ({
        slug: field.slug,
        collectionId: field.validations?.collectionId,
        isMulti: field.type === "MultiReference",
      }))
      .filter((field) => field.collectionId)
  }, [collectionSchema])
 



  useEffect(() => {
    const fetchReferenceItems = async () => {
      const newReferenceCollections: Record<string, any[]> = {}

      for (const field of referenceFields) {
        if (field.collectionId) {
          try {
            const items = await fetchItems(field.collectionId)
            newReferenceCollections[field.slug] = items
          } catch (error) {
            console.error(`Error fetching reference items for ${field.slug}:`, error)
          }
        }
      }

      setReferenceCollections(newReferenceCollections)
    }

    if (referenceFields.length > 0) {
      fetchReferenceItems()
    }
  }, [referenceFields, setReferenceCollections])

  const mutationUpdate = useMutation<any[], Error, any>((payload) => updateItems(selectedCollectionId, payload), {
    onSuccess: () => {
      refetchItems()
      toast.success("Items updated successfully!")
      setEditedItems({}) 
    },
    onError: (error) => {
      console.error("Update error:", error)
      toast.error("Failed to update items.")
    },
  })

  const mutationDelete = useMutation<void, Error, string[]>((ids: string[]) => deleteItems(selectedCollectionId, ids), {
    onSuccess: () => {
      toast.success("Items deleted successfully!")
      setSelectedIds([]) 
      refetchItems()
    },
    onError: (error) => {
      console.error("Delete error:", error)
      toast.error("Failed to delete items.")
    },
  })

  const mutationCreate = useMutation<any[], Error, { items: Array<{ fields: Record<string, any> }> }>(
    (payload) => api.post(`/collections/${selectedCollectionId}/items`, payload).then((res) => res.data),
    {
      onSuccess: () => {
        refetchItems()
        toast.success("Items created successfully!")
        setNewItems({})
      },
      onError: (error) => {
        console.error("Create error:", error)
        toast.error("Failed to create items.")
      },
    },
  )

  const allFieldKeys = useMemo(() => {
    const keySet = new Set<string>()
    items.forEach((item) => {
      Object.keys(item.fieldData).forEach((key) => keySet.add(key))
    })
    return [...Array.from(keySet), "lastUpdated", "createdOn"]
  }, [items])

  const getFieldDefinition = (slug: string): FieldDefinition | undefined => {
    return collectionSchema.find((field) => field.slug === slug)
  }

  const getReferenceItemName = (referenceId: string, fieldSlug: string): string => {
    if (!referenceId || !referenceCollections[fieldSlug]) return referenceId

    const referenceItem = referenceCollections[fieldSlug].find((item) => item.id === referenceId)
    return referenceItem ? referenceItem.fieldData.name : referenceId
  }

  const getReferenceItems = (fieldSlug: string) => {
    return referenceCollections[fieldSlug] || []
  }


const filteredItems = useMemo(() => {
  const now = new Date()

  return items.filter((item) => {
    if (lastUpdatedFilter !== "all" && item.lastUpdated) {
      const updatedDate = new Date(item.lastUpdated)
      let thresholdDate: Date

      switch (lastUpdatedFilter) {
        case "2d":
          thresholdDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
          break
        case "10d":
          thresholdDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
          break
        case "30d":
          thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "1m":
          thresholdDate = new Date()
          thresholdDate.setMonth(thresholdDate.getMonth() - 1)
          break
        default:
          thresholdDate = new Date(0) 
      }

      if (updatedDate < thresholdDate) return false
    }

    const fieldDataMatch = Object.entries(item.fieldData).some(([key, val]) => {
      if (typeof val === "string") {
        return val.toLowerCase().includes(searchQuery.toLowerCase())
      }

      const fieldDef = getFieldDefinition(key)
      if (fieldDef?.type === "Reference") {
        const referenceName = getReferenceItemName(val as string, key)
        return referenceName.toLowerCase().includes(searchQuery.toLowerCase())
      } else if (fieldDef?.type === "MultiReference" && Array.isArray(val)) {
        return val.some((refId) => {
          const referenceName = getReferenceItemName(refId, key)
          return referenceName.toLowerCase().includes(searchQuery.toLowerCase())
        })
      }

      return false
    })

    const createdOnMatch = item.createdOn
      ? new Date(item.createdOn).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
      : false

    const lastUpdatedMatch = item.lastUpdated
      ? new Date(item.lastUpdated).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase())
      : false

    return fieldDataMatch || createdOnMatch || lastUpdatedMatch
  })
}, [items, searchQuery, referenceCollections, lastUpdatedFilter])

  const sortedItems = useMemo(() => {
    if (!sortKey) return filteredItems

    const sorted = [...filteredItems].sort((a, b) => {
      if (sortKey === "lastUpdated" || sortKey === "createdOn") {

        function toValidDate(value: unknown): Date {
          if (value instanceof Date) return value;
          if (typeof value === "string" || typeof value === "number") {
            const date = new Date(value);
            if (!isNaN(date.getTime())) return date;
          }
          return new Date(); 
        }

        const aValue = a[sortKey as keyof ExtendedItem];
        const bValue = b[sortKey as keyof ExtendedItem];

        const aDate = toValidDate(aValue).getTime();
        const bDate = toValidDate(bValue).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate
      }

      const fieldDef = getFieldDefinition(sortKey)
      if (fieldDef?.type === "Reference") {
        const aVal = a.fieldData[sortKey] as string
        const bVal = b.fieldData[sortKey] as string

        const aName = aVal ? getReferenceItemName(aVal, sortKey) : ""
        const bName = bVal ? getReferenceItemName(bVal, sortKey) : ""
        return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName)
      } else if (fieldDef?.type === "MultiReference") {
        const aVal = (a.fieldData[sortKey] as string[]) || []
        const bVal = (b.fieldData[sortKey] as string[]) || []

        if (aVal.length !== bVal.length) {
          return sortOrder === "asc" ? aVal.length - bVal.length : bVal.length - aVal.length
        }

        if (aVal.length > 0 && bVal.length > 0) {
          const aName = getReferenceItemName(aVal[0], sortKey)
          const bName = getReferenceItemName(bVal[0], sortKey)
          return sortOrder === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName)
        }

        return 0
      }

      const aVal = a.fieldData[sortKey] || ""
      const bVal = b.fieldData[sortKey] || ""

      return sortOrder === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal))
    })

    return sorted
  }, [filteredItems, sortKey, sortOrder, referenceCollections])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedItems.slice(start, start + pageSize)
  }, [sortedItems, currentPage, pageSize])

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleUpdateEditedItem = (id: string, key: string, value: any) => {
    setEditedItems((prev) => {
      const updatedItem = { ...prev[id], [key]: value }

      if (key === "name" && typeof value === "string" && collectionSchema.some((field) => field.slug === "slug")) {
        updatedItem.slug = generateSlug(value)
      }

      return {
        ...prev,
        [id]: updatedItem,
      }
    })
  }

  const handleBulkColumnUpdate = () => {
    if (!bulkEditColumn || !bulkEditValue) return

    const updatedItems = { ...editedItems }
    const itemsToUpdate: Array<{ _id: string; fields: Record<string, any> }> = []

    const fieldDef = getFieldDefinition(bulkEditColumn)
    let processedValue = bulkEditValue

    if (fieldDef) {
      switch (fieldDef.type) {
        case "Number":
          processedValue = Number(bulkEditValue)
          break
        case "Switch":
          processedValue = bulkEditValue.toLowerCase() === "true"
          break
        case "Reference":
          processedValue = bulkEditValue
          break
        case "MultiReference":
          processedValue = Array.isArray(bulkEditValue) ? bulkEditValue : bulkEditValue ? [bulkEditValue] : []
          break
      }
    }

    sortedItems.forEach((item) => {
      if (bulkEditColumn !== "lastUpdated" && bulkEditColumn !== "createdOn") {
        updatedItems[item.id] = {
          ...(updatedItems[item.id] || {}),
          [bulkEditColumn]: processedValue,
        }

        if (
          bulkEditColumn === "name" &&
          typeof processedValue === "string" &&
          collectionSchema.some((field) => field.slug === "slug")
        ) {
          updatedItems[item.id].slug = generateSlug(processedValue)
        }

        const fieldsToUpdate = { [bulkEditColumn]: processedValue }

        if (
          bulkEditColumn === "name" &&
          typeof processedValue === "string" &&
          collectionSchema.some((field) => field.slug === "slug")
        ) {
          fieldsToUpdate.slug = generateSlug(processedValue)
        }

        itemsToUpdate.push({
          _id: item.id,
          fields: fieldsToUpdate,
        })
      }
    })

    setEditedItems(updatedItems)

    if (itemsToUpdate.length > 0) {
      const payload = {
        items: itemsToUpdate,
      }
      mutationUpdate.mutate(payload)
    }

    setBulkEditColumn(null)
    setBulkEditValue("")
  }

  const cancelBulkEdit = () => {
    setBulkEditColumn(null)
    setBulkEditValue("")
  }

  const handleSaveAll = () => {
    const payload = {
      items: Object.entries(editedItems).map(([id, fields]) => ({
        _id: id,
        fields: cleanEmptyFields(fields),
      })),
    }
    mutationUpdate.mutate(payload)
  }

  const handleDeleteSelected = () => {
    mutationDelete.mutate(selectedIds)
  }

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const handleAddNewItem = () => {
    const tempId = `new-${new Date().getTime().toString()}`
    const emptyFields: Record<string, any> = {}

    collectionSchema.forEach((field) => {
      if (field.type === "MultiReference") {
        emptyFields[field.slug] = []
      } else if (field.type === "Switch") {
        emptyFields[field.slug] = false
      } else {
        emptyFields[field.slug] = ""
      }
    })

    setNewItems((prev) => ({
      ...prev,
      [tempId]: emptyFields,
    }))
  }

  const handleUpdateNewItem = (id: string, key: string, value: any) => {
    setNewItems((prev) => {
      const updatedItem = { ...prev[id], [key]: value }

      if (key === "name" && typeof value === "string" && collectionSchema.some((field) => field.slug === "slug")) {
        updatedItem.slug = generateSlug(value)
      }

      return {
        ...prev,
        [id]: updatedItem,
      }
    })
  }

  const handleSaveNewItems = () => {
    const payload = {
      items: Object.values(newItems).map((fields) => {
        const cleanedFields = cleanEmptyFields(fields)

        delete cleanedFields.createdOn
        delete cleanedFields.lastUpdated

        return { fields: cleanedFields }
      }),
    }

    console.log("Creating new items with payload:", payload)

    if (payload.items.length > 0) {
      mutationCreate.mutate(payload)
    } else {
      toast.warning("No new items to create")
    }
  }

  const getFieldIcon = (fieldSlug: string) => {
    const fieldDef = getFieldDefinition(fieldSlug)
    if (!fieldDef) return null

    switch (fieldDef.type) {
      case "PlainText":
        return <FileText size={14} className="text-gray-400" />
      case "RichText":
        return <FileText size={14} className="text-gray-400" />
      case "ImageRef":
        return <ImageIcon size={14} className="text-gray-400" />
      case "VideoLink":
        return <Video size={14} className="text-gray-400" />
      case "Link":
        return <LinkIcon size={14} className="text-gray-400" />
      case "Email":
        return <Mail size={14} className="text-gray-400" />
      case "Phone":
        return <Phone size={14} className="text-gray-400" />
      case "Number":
        return <Hash size={14} className="text-gray-400" />
      case "DateTime":
        return <Calendar size={14} className="text-gray-400" />
      case "Switch":
        return <Check size={14} className="text-gray-400" />
      case "Color":
        return <Palette size={14} className="text-gray-400" />
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex items-center flex-col gap-0">
      <div className="w-full p-3">
        <CollectionSelector
          collections={collections}
          selectedCollectionId={selectedCollectionId}
          searchQuery={searchQuery}
          setSelectedCollectionId={setSelectedCollectionId}
          setSearchQuery={setSearchQuery}
          handleAddNewItem={handleAddNewItem}
          lastUpdatedFilter={lastUpdatedFilter}
          setLastUpdatedFilter={setLastUpdatedFilter}
        />
      </div>

     <div className="w-[800px] h-[440px]">
            <div className="h-full w-full overflow-scroll custom-scroll border border-[#444] shadow-md bg-[#1a1a1a]">
              <table className="min-w-[800px] border-collapse border text-sm rounded-sm">
                <TableHeader
                  allFieldKeys={allFieldKeys}
                  selectedIds={selectedIds}
                  paginatedItems={paginatedItems}
                  sortKey={sortKey}
                  sortOrder={sortOrder}
                  bulkEditColumn={bulkEditColumn}
                  setSelectedIds={setSelectedIds}
                  handleSort={handleSort}
                  setBulkEditColumn={setBulkEditColumn}
                  setBulkEditValue={setBulkEditValue}
                  getFieldIcon={getFieldIcon}
                />

                <tbody className="divide-y divide-[#333]">
                  {Object.entries(newItems).map(([tempId, fieldData]) => (
                    <tr key={tempId} className="bg-[#2a2a2a] hover:bg-[#333] transition">
                      <td className="border border-[#444] text-center">
                        <button
                          onClick={() =>
                            setNewItems((prev) => {
                              const updated = { ...prev }
                              delete updated[tempId]
                              return updated
                            })
                          }
                          className="text-red-500 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </td>
                      {allFieldKeys.map((key) => (
                        <td key={key} className="border border-[#444] px-4 py-3">
                          {key === "lastUpdated" || key === "createdOn" ? (
                            <div className="text-gray-400 whitespace-nowrap">
                              {key === "createdOn" ? "Will be set on creation" : "Will be set on update"}
                            </div>
                          ) : (
                            <RenderFieldInput
                              item={{ id: tempId, fieldData } as ExtendedItem}
                              fieldKey={key}
                              isNewItem={true}
                              fieldDefinition={getFieldDefinition(key)}
                              fieldData={fieldData[key]}
                              referenceItems={getReferenceItems(key)}
                              referenceItemName={
                                fieldData[key] && typeof fieldData[key] === "string"
                                  ? getReferenceItemName(fieldData[key], key)
                                  : "Select..."
                              }
                              onUpdate={handleUpdateNewItem}
                              getReferenceItemName={getReferenceItemName}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {paginatedItems.map((item) => {
                    const { id } = item
                    const lastUpdated = item.lastUpdated || ""
                    const createdOn = item.createdOn || ""

                    return (
                      <tr key={id} className="hover:bg-[#2f2f2f] transition">
                        <td className="border border-[#444] text-center">
                          <Checkbox checked={selectedIds.includes(id)} onCheckedChange={() => toggleSelectedId(id)} className="rounded-full" />
                        </td>
                        {allFieldKeys.map((key) => (
                          <td key={key} className="border border-[#444]">
                            {key === "lastUpdated" ? (
                              <div className="py-2 px-3 whitespace-nowrap">{lastUpdated ? new Date(lastUpdated).toLocaleString() : "N/A"}</div>
                            ) : key === "createdOn" ? (
                              <div className="py-2 px-3 whitespace-nowrap">{createdOn ? new Date(createdOn).toLocaleString() : "N/A"}</div>
                            ) : (
                              <RenderFieldInput
                                item={item}
                                fieldKey={key}
                                fieldDefinition={getFieldDefinition(key)}
                                fieldData={editedItems[id]?.[key] ?? item.fieldData[key]}
                                referenceItems={getReferenceItems(key)}
                                referenceItemName={
                                  item.fieldData[key] && typeof item.fieldData[key] === "string"
                                    ? getReferenceItemName(editedItems[id]?.[key] ?? item.fieldData[key], key)
                                    : "Select..."
                                }
                                onUpdate={handleUpdateEditedItem}
                                getReferenceItemName={getReferenceItemName}
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
      </div>

      {bulkEditColumn && (
        <div className="w-full absolute bottom-12 px-3 py-2 bg-[#1e1e1e] rounded flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-white">
              Bulk edit column: <strong>{bulkEditColumn}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <BulkEditField
              fieldDefinition={getFieldDefinition(bulkEditColumn)}
              bulkEditValue={bulkEditValue}
              setBulkEditValue={setBulkEditValue}
              referenceItems={getReferenceItems(bulkEditColumn)}
            />

            <button
              onClick={handleBulkColumnUpdate}
              disabled={mutationUpdate.isLoading}
              className={`px-4 py-1 ${
                mutationUpdate.isLoading
                  ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                  : "bg-[#006acc] text-white hover:bg-[#0055aa]"
              } rounded`}
            >
              {mutationUpdate.isLoading ? "Applying..." : "Apply to All"}
            </button>
            <button onClick={cancelBulkEdit} className="px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="w-full flex items-center justify-between p-3 sticky bottom-0 bg-[#1e1e1e]">
        <ActionButtons
          newItemsCount={Object.keys(newItems).length}
          editedItemsCount={Object.keys(editedItems).length}
          selectedIdsCount={selectedIds.length}
          isCreating={mutationCreate.isLoading}
          isUpdating={mutationUpdate.isLoading}
          isDeleting={mutationDelete.isLoading}
          handleSaveNewItems={handleSaveNewItems}
          handleSaveAll={handleSaveAll}
          handleDeleteSelected={handleDeleteSelected}
        />

        <Pagination
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={filteredItems.length}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  )
}
