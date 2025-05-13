import { FieldDefinition, Item } from "@/types"
import {  CalendarIcon, X } from "lucide-react"
import { Switch } from "../ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
// import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogTrigger } from "../ui/alert-dialog"
// import RichTextField from "./RichTextField"
// import { IoMdClose } from "react-icons/io"

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
      case "File":
      case "ImageRef": 
        const fileData = typeof bulkEditValue === "object" ? bulkEditValue : { url: bulkEditValue }
        return (
          <div className="flex-1">
            <div className="bg-[#1e1e1e] text-white border border-gray-600 rounded p-2">
              <label className="block mb-2 font-medium">Enter file/image URL:</label>
              <input
                className="w-full rounded px-3 py-2 text-sm bg-transparent text-white border border-gray-600"
                type="text"
                value={fileData.url || ""}
                onChange={(e) => {
                  const newValue = { ...fileData, url: e.target.value }
                  setBulkEditValue(newValue)
                }}
                placeholder="https://example.com/file.jpg"
              />
            </div>
          </div>
        )
      

    case "VideoLink": 
      const linkData = typeof bulkEditValue === "object" ? bulkEditValue : { url: bulkEditValue }
      return (
        <div className="flex-1">
          <div className="bg-[#1e1e1e] text-white border border-gray-600 rounded p-2">
            <label className="block mb-2 font-medium">Enter video link URL:</label>
            <input
              className="w-full rounded px-3 py-2 text-sm bg-transparent text-white border border-gray-600"
              type="text"
              value={linkData.url || ""}
              onChange={(e) => {
                const newValue = { ...linkData, url: e.target.value }
                setBulkEditValue(newValue)
              }}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
      )
    

    case "Switch":
      return (
        <div className="flex-1">
          <div className="flex items-center gap-3 bg-[#1e1e1e] text-white border border-gray-600 rounded p-2">
            <label className="text-sm">Toggle switch:</label>
            <Switch
              checked={Boolean(bulkEditValue)}
              onCheckedChange={(checked) => setBulkEditValue(checked)}
            />
            <span className="text-sm">{bulkEditValue ? "Yes" : "No"}</span>
          </div>
        </div>
      )
  // case "RichText":
  //   return (
  //     <AlertDialog>
  //       <AlertDialogTrigger asChild>
  //         <button className="w-full text-left rounded-none px-3 py-2 text-sm bg-transparent text-white hover:bg-gray-800">
  //           {bulkEditValue ? (
  //             <div className="truncate max-w-[200px]">
  //               {typeof bulkEditValue === "string"
  //                 ? bulkEditValue.substring(0, 50)
  //                 : "Rich content..."}...
  //             </div>
  //           ) : (
  //             <span className="text-gray-400">Edit content...</span>
  //           )}
  //         </button>
  //       </AlertDialogTrigger>

  //       <AlertDialogContent className="p-0 relative bg-[#1e1e1e] border border-gray-700">
  //         <div className="p-4">
  //           <RichTextField
  //             id={id}
  //             fieldData={bulkEditValue || ""}
  //             fieldKey={fieldKey}
  //             onUpdate={(id, key, value) => {
  //               setBulkEditValue(value) // update local state
  //               onUpdate(id, key, value) // persist to parent
  //             }}
  //             key={fieldKey}
  //           />
  //         </div>
  //         <AlertDialogAction
  //           className="h-8 w-8 flex items-center justify-center absolute -right-3 -top-3 bg-gray-700 text-white rounded-full hover:bg-red-600"
  //           aria-label="Close"
  //         >
  //           <IoMdClose />
  //         </AlertDialogAction>
  //       </AlertDialogContent>
  //     </AlertDialog>
  //   )

  case "DateTime":
    return (
      <div className="flex-1">
        <div className="relative w-full max-w-[250px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal !bg-[#1e1e1e] text-white border-gray-600",
                  !bulkEditValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bulkEditValue
                  ? format(new Date(bulkEditValue), "yyyy-MM-dd HH:mm")
                  : "Pick a date & time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 space-y-2 bg-[#1e1e1e] text-white border border-gray-600">
              <Calendar
                mode="single"
                selected={
                  bulkEditValue
                    ? typeof bulkEditValue === "string" || typeof bulkEditValue === "number"
                      ? new Date(bulkEditValue)
                      : bulkEditValue instanceof Date
                      ? bulkEditValue
                      : undefined
                    : undefined
                }
                onSelect={(selectedDate) => {
                  if (!selectedDate) return
                  const currentTime = bulkEditValue
                    ? new Date(bulkEditValue)
                    : new Date()
                  const updatedDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    currentTime.getHours(),
                    currentTime.getMinutes()
                  )
                  setBulkEditValue(updatedDate.toISOString())
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    )


  case "Color":
    return (
      <div className="flex-1">
        <div className="bg-[#1e1e1e] text-white border border-gray-600 rounded p-2">
          <label className="block mb-2 font-medium">Pick a color:</label>
          <input
            type="color"
            value={bulkEditValue || "#000000"}
            onChange={(e) => setBulkEditValue(e.target.value)}
            className="w-16 h-10 p-0 border-none outline-none"
          />
          <div className="mt-2 text-sm">Selected: {bulkEditValue || "#000000"}</div>
        </div>
      </div>
    );
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
