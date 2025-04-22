import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import api from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

// Define types for API responses
interface Collection {
  id: string;
  displayName: string;
}

interface FieldData {
  [key: string]: string;
}

interface Item {
  id: string;
  fieldData: FieldData;
}

interface UpdatePayload {
  items: Array<{ _id: string; fields: Record<string, string> }>;
}

// Fetch collections with React Query
const fetchCollections = async (): Promise<Collection[]> => {
  const res = await api.get('/collections');
  return res.data.collections;
};

// Fetch items in a collection
const fetchItems = async (collectionId: string): Promise<Item[]> => {
  const res = await api.get(`/collections/${collectionId}/items`);
  return res.data.collectionItems.items;
};

// Update items
const updateItems = async (collectionId: string, payload: UpdatePayload): Promise<Item[]> => {
  const res = await api.patch(`/collections/${collectionId}/items`, payload);
  return res.data.collectionItems.items;
};

// Delete selected items
const deleteItems = async (collectionId: string, ids: string[]): Promise<void> => {
  await Promise.all(ids.map((id) => api.delete(`/collections/${collectionId}/items/${id}`)));
};

export default function Collections() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [editedItems, setEditedItems] = useState<Record<string, Record<string, string>>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bulkEdits, setBulkEdits] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const queryClient = useQueryClient();

  // Fetch collections using React Query
  const { data: collections = [] } = useQuery<Collection[]>('collections', fetchCollections);

  // Fetch items when collection changes
  const { data: items = [], refetch: refetchItems } = useQuery<Item[]>(
    ['items', selectedCollectionId],
    () => fetchItems(selectedCollectionId),
    {
      enabled: !!selectedCollectionId, 
    }
  );

  // Update items mutation with React Query
  const mutationUpdate = useMutation<Item[], Error, UpdatePayload>(
    (payload: UpdatePayload) => updateItems(selectedCollectionId, payload),
    {
      onSuccess: () => {
        refetchItems();
        toast.success('Items updated successfully!');
      },
      onError: (d) => {
        toast.error('Failed to update items.');
      },
    }
  );

  // Delete items mutation with React Query
  const mutationDelete = useMutation<void, Error, string[]>(
    (ids: string[]) => deleteItems(selectedCollectionId, ids),
    {
      onSuccess: () => {
        toast.success('Items deleted successfully!');
        refetchItems(); 
      },
      onError: () => {
        toast.error('Failed to delete items.');
      },
    }
  );

  const allFieldKeys = useMemo(() => {
    const keySet = new Set<string>();
    items.forEach((item) => {
      Object.keys(item.fieldData).forEach((key) => keySet.add(key));
    });
    return Array.from(keySet);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      Object.values(item.fieldData).some(
        (val) =>
          typeof val === 'string' &&
          val.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUpdateEditedItem = (id: string, key: string, value: string) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleBulkFieldChange = (key: string, value: string) => {
    setBulkEdits((prev) => ({ ...prev, [key]: value }));
    setEditedItems((prev) => {
      const updated = { ...prev };
      items.forEach((item) => {
        updated[item.id] = { ...updated[item.id], [key]: value };
      });
      return updated;
    });
  };

  const handleClearBulkField = (key: string) => {
    setBulkEdits((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleSaveAll = async () => {
    const payload: UpdatePayload = {
      items: Object.entries(editedItems).map(([id, fields]) => ({
        _id: id,
        fields,
      })),
    };
    mutationUpdate.mutate(payload); 
  };

  const handleDeleteSelected = async () => {
    mutationDelete.mutate(selectedIds); 
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 gap-4">
        <Select
          value={selectedCollectionId}
          onValueChange={(value) => setSelectedCollectionId(value)}
        >
          <SelectTrigger className="w-[200px] bg-[#1e1e1e] text-white">
            <SelectValue placeholder="Select a collection" />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e1e] text-white">
            {collections.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                {col.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-2 py-1 border rounded bg-transparent text-white"
        />
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-transparent text-white">
            <th className="border p-2">Select</th>
            {allFieldKeys.map((key) => (
              <th key={key} className="border p-2">
                <div className="flex flex-col items-center gap-1">
                  <span>{key}</span>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Edit all"
                      value={bulkEdits[key] || ''}
                      onChange={(e) => handleBulkFieldChange(key, e.target.value)}
                      className="w-full text-xs px-1 py-0.5 bg-transparent text-white border"
                    />
                    {bulkEdits[key] && (
                      <button
                        onClick={() => handleClearBulkField(key)}
                        className="absolute top-1 right-1 text-xs text-white bg-gray-600 rounded-full p-0.5 hover:bg-gray-500"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map(({ id, fieldData }) => (
            <tr key={id}>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(id)}
                  onChange={() => toggleSelectedId(id)}
                />
              </td>
              {allFieldKeys.map((key) => (
                <td key={key} className="border">
                  <input
                    className="w-full rounded-none px-3 py-2 text-sm bg-transparent text-white"
                    type="text"
                    value={editedItems[id]?.[key] ?? fieldData[key] ?? ''}
                    onChange={(e) => handleUpdateEditedItem(id, key, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-end gap-5 mt-6">
        <button
          onClick={handleSaveAll}
          disabled={Object.keys(editedItems).length === 0 || mutationUpdate.isLoading}
          className={`px-4 py-2 rounded ${
            Object.keys(editedItems).length === 0 || mutationUpdate.isLoading
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-[#006acc] text-white'
          }`}
        >
          {mutationUpdate.isLoading ? 'Saving...' : 'Save All'}
        </button>

        <button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0 || mutationDelete.isLoading}
          className={`px-4 py-2 rounded ${
            selectedIds.length === 0 || mutationDelete.isLoading
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : 'bg-red-600 text-white'
          }`}
        >
          {mutationDelete.isLoading ? 'Deleting...' : 'Delete Selected'}
        </button>
      </div>

      {filteredItems.length > pageSize && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: Math.ceil(filteredItems.length / pageSize) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-[#006acc] text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
