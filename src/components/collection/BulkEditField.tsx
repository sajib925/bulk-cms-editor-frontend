import { X } from "lucide-react"
import type { FieldDefinition, Item } from "@/lib/types"

interface BulkEditFieldProps {
  fieldDefinition: FieldDefinition | undefined
  bulkEditValue: any
  setBulkEditValue: (value: any) => void
  referenceItems: Item[]
}

const BulkEditField = ({ fieldDefinition, bulkEditValue, setBulkEditValue, referenceItems }: BulkEditFieldProps) => {
  if (!fieldDefinition) return null

  switch (fieldDefinition.type) {
    case "Reference":
      return (
        <div className="flex-1">
          <div className="bg-[#1e1e1e] text-white border border-gray-600 rounded p-2">
            <div className="mb-2 flex items-center">
              <input
                type="radio"
                id="none-option"
                name="reference-option"
                value=""
                checked={bulkEditValue === ""}
                onChange={() => setBulkEditValue("")}
                className="mr-2"
              />
              <label htmlFor="none-option">None</label>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {referenceItems.map((refItem) => (
                <div key={refItem.id} className="mb-2 flex items-center">
                  <input
                    type="radio"
                    id={`ref-${refItem.id}`}
                    name="reference-option"
                    value={refItem.id}
                    checked={bulkEditValue === refItem.id}
                    onChange={() => setBulkEditValue(refItem.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`ref-${refItem.id}`}>{refItem.fieldData.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    case "MultiReference":
      // Ensure bulkEditValue is always an array
      const selectedValues = Array.isArray(bulkEditValue) ? bulkEditValue : bulkEditValue ? [bulkEditValue] : []

      const toggleReference = (refId: string) => {
        if (selectedValues.includes(refId)) {
          setBulkEditValue(selectedValues.filter((id: string) => id !== refId))
        } else {
          setBulkEditValue([...selectedValues, refId])
        }
      }

      return (
        <div className="flex-1">
          <div className="bg-[#1e1e1e] text-white border border-gray-600 rounded p-2">
            <div className="mb-2 font-medium">Select references to apply to all items:</div>
            <div className="max-h-[200px] overflow-y-auto">
              {referenceItems.map((refItem) => (
                <div key={refItem.id} className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id={`multiref-${refItem.id}`}
                    checked={selectedValues.includes(refItem.id)}
                    onChange={() => toggleReference(refItem.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`multiref-${refItem.id}`}>{refItem.fieldData.name}</label>
                </div>
              ))}
            </div>
            {selectedValues.length > 0 && (
              <div className="mt-2 text-sm">
                <div className="font-medium">Selected ({selectedValues.length}):</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedValues.map((refId: string) => {
                    const refItem = referenceItems.find((item) => item.id === refId)
                    return (
                      <div key={refId} className="bg-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                        {refItem?.fieldData.name || refId}
                        <button onClick={() => toggleReference(refId)} className="text-gray-300 hover:text-white">
                          <X size={12} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-300">
            Note: This will replace all existing references with the selected references.
          </div>
        </div>
      )

    default:
      return (
        <input
          type="text"
          value={String(bulkEditValue || "")}
          onChange={(e) => setBulkEditValue(e.target.value)}
          placeholder={`Enter value for all ${fieldDefinition.slug} fields`}
          className="flex-1 px-3 py-1 bg-[#1e1e1e] text-white border border-gray-600 rounded"
        />
      )
  }
}

export default BulkEditField
