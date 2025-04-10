import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Collection, CollectionItem, FieldData } from "@/types";



export default function CollectionTable() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [editedItems, setEditedItems] = useState<Record<string, FieldData>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollectionId) {
      fetchItems(selectedCollectionId);
    }
  }, [selectedCollectionId]);

  const fetchCollections = async () => {
    const res = await api.get("/collections");
    setCollections(res.data.collections);
    setSelectedCollectionId(res.data.collections[0]?.id || "");
  };

  const fetchItems = async (collectionId: string) => {
    const res = await api.get(`/collections/${collectionId}/items`);
    setItems(res.data.collectionItems.items);
  };

  const handleFieldChange = (id: string, field: string, value: string) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = async (id: string) => {
    if (!editedItems[id]) return;
    await api.patch(`/collections/${selectedCollectionId}/items/${id}`, {
      ...editedItems[id], 
    });
    setEditedItems((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
    fetchItems(selectedCollectionId);
  };

  const handleDeleteSelected = async () => {
    await Promise.all(
      selectedIds.map((id) =>
        api.delete(`/collections/${selectedCollectionId}/items/${id}`)
      )
    );
    setSelectedIds([]);
    fetchItems(selectedCollectionId);
  };

  const toggleCheckbox = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const allFieldKeys = useMemo(() => {
    const keySet = new Set<string>();
    items.forEach((item) => {
      Object.keys(item.fieldData).forEach((key) => keySet.add(key));
    });
    return Array.from(keySet);
  }, [items]);

  return (
    <div className="p-4">
      {/* Collection Switcher */}
      <div className="flex justify-between items-center mb-4 ">
        <select
          value={selectedCollectionId}
          onChange={(e) => setSelectedCollectionId(e.target.value)}
          className="px-2 py-1 border rounded bg-gray-700"
        >
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.displayName}
            </option>
          ))}
        </select>
        {/* Delete Selected */}
        {selectedIds.length > 0 && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        )}
      </div>
      {/* Table */}
      <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-700 w-full">
            <th className="border p-2">Select</th>
            {allFieldKeys.map((key) => (
              <th key={key} className="border p-2 capitalize">
                {key}
              </th>
            ))}
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ id, fieldData }) => (
            <tr key={id} className="">
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(id)}
                  onChange={() => toggleCheckbox(id)}
                />
              </td>
              {allFieldKeys.map((key) => (
                <td key={key} className="border px-2">
                  <input
                    type="text"
                    value={editedItems[id]?.[key] ?? fieldData[key] ?? ""}
                    onChange={(e) =>
                      handleFieldChange(id, key, e.target.value)
                    }
                    className="w-full border p-1 bg-gray-700"
                  />
                </td>
              ))}
              <td className="border p-2 text-center">
                <button
                  className="text-blue-600 hover:underline text-sm"
                  onClick={() => handleSave(id)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
