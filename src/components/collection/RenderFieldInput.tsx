import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { IoMdClose } from "react-icons/io";
import RichTextField from "./RichTextField"
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogTrigger } from "../ui/alert-dialog"
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { ExtendedItem, FieldDefinition, Item } from "@/types";



interface RenderFieldInputProps {
  item: ExtendedItem
  fieldKey: string
  isNewItem?: boolean
  fieldDefinition?: FieldDefinition
  fieldData: any
  referenceItems: Item[]
  referenceItemName: string
  onUpdate: (id: string, key: string, value: any) => void
  getReferenceItemName?: (refId: string, fieldSlug: string) => string
}

export const RenderFieldInput = ({
  item,
  fieldKey,
  // isNewItem = false,
  fieldDefinition,
  fieldData,
  referenceItems,
  referenceItemName,
  onUpdate,
  getReferenceItemName,
}: RenderFieldInputProps) => {
  const id = item.id

  if (!fieldDefinition) {
    return (
      <input
        className="w-[300px] rounded-none px-3 py-2 text-sm bg-transparent text-white"
        type="text"
        value={typeof fieldData === "object" ? JSON.stringify(fieldData) : String(fieldData || "")}
        onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
      />
    )
  }

  switch (fieldDefinition.type) {

    case "Reference":
      return (
        <div className="flex flex-col">
          <input type="hidden" value={fieldData || ""} />

          <Select value={String(fieldData || "")} onValueChange={(value) => onUpdate(id, fieldKey, value)}>
            <SelectTrigger className="w-[200px] rounded-none px-3 py-2 text-sm bg-transparent text-white border-0 h-auto">
              <SelectValue placeholder="Select reference">{fieldData ? referenceItemName : "Select..."}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] text-white max-h-[200px]">
              <SelectItem value="none">None</SelectItem>
              {referenceItems.map((refItem) => (
                <SelectItem key={refItem.id} value={refItem.id}>
                  {refItem.fieldData.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )

    case "MultiReference":
      const normalizedFieldData = Array.isArray(fieldData) ? fieldData : fieldData ? [fieldData] : []

      return (
        <>
        <div className="flex flex-col w-[300px] py-2 px-3">
          <div className="text-sm text-white">
            {normalizedFieldData.length > 0 ? (
              <div className="max-h-[100px] overflow-y-auto flex flex-wrap items-center gap-2">
                {normalizedFieldData.map((refId: string) => {
                  const refName = getReferenceItemName
                    ? getReferenceItemName(refId, fieldKey)
                    : referenceItems.find((item) => item.id === refId)?.fieldData.name || refId

                  return (
                    <div key={refId} className="text-sm bg-blue-700 text-white py-1 px-2 rounded-sm whitespace-nowrap">
                      {refName}
                    </div>
                  )
                })}
              </div>
            ) : (
              <span className="text-gray-400">None</span>
            )}
          </div>

          <AlertDialog>
          <AlertDialogTrigger>
             <button className="mt-1 text-left text-xs bg-[#006acc] text-white px-2 py-1 rounded">
                Edit References ({normalizedFieldData.length})
              </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="p-3">
           <div className="mb-2 text-lg font-medium text-white">Selected References:</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {normalizedFieldData.length > 0 ? (
                  normalizedFieldData.map((refId: string) => {
                    const refName = getReferenceItemName
                      ? getReferenceItemName(refId, fieldKey)
                      : referenceItems.find((item) => item.id === refId)?.fieldData.name || refId

                    return (
                      <div
                        key={refId}
                        className="bg-gray-700 text-xs text-white px-2 py-1 rounded flex items-center gap-1"
                      >
                        {refName}
                        <button
                          onClick={() => {
                            const newValue = normalizedFieldData.filter((id: string) => id !== refId)
                            onUpdate(id, fieldKey, newValue)
                          }}
                          className="text-gray-300 hover:text-white"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                    )
                  })
                ) : (
                  <span className="text-gray-100 text-xs">No items selected</span>
                )}
              </div>

              <div className="mb-2 text-sm font-medium text-white">Available References:</div>
              <div className="max-h-[200px] overflow-y-auto">
                {referenceItems.map((refItem) => {
                  const isSelected = normalizedFieldData.includes(refItem.id)
                  return (
                    <div
                      key={refItem.id}
                      className={`px-2 py-1 cursor-pointer hover:bg-gray-700 flex items-center gap-2 ${
                        isSelected ? "bg-gray-700" : ""
                      }`}
                      onClick={() => {
                        let newValue
                        if (isSelected) {
                          newValue = normalizedFieldData.filter((id: string) => id !== refItem.id)
                        } else {
                          newValue = [...normalizedFieldData, refItem.id]
                        }
                        onUpdate(id, fieldKey, newValue)
                      }}
                    >
                      <Checkbox checked={isSelected} />
                      <span className="text-white">{refItem.fieldData.name}</span>
                    </div>
                  )
                })}
              </div>
         <AlertDialogAction className="h-8 w-8 flex items-center justify-center absolute -right-6 -top-6 rounded-full">
          <IoMdClose />
         </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
          
        </div>
        </>
        
      )

    case "DateTime":
      return (
        <div className="relative w-[200px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal !bg-transparent px-3",
                  !fieldData && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fieldData
                  ? format(new Date(fieldData), "yyyy-MM-dd HH:mm")
                  : "Pick a date & time"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4 space-y-2">
              <Calendar
                mode="single"
                selected={
                  fieldData
                    ? typeof fieldData === "string" || typeof fieldData === "number"
                      ? new Date(fieldData)
                      : fieldData instanceof Date
                      ? fieldData
                      : undefined
                    : undefined
                }
                onSelect={(selectedDate) => {
                  if (!selectedDate) return
                  const time = fieldData
                    ? new Date(fieldData)
                    : new Date()
                  const updatedDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    time.getHours(),
                    time.getMinutes()
                  )
                  onUpdate(id, fieldKey, updatedDate.toISOString())
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )

    case "Switch":
      return (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={Boolean(fieldData)}
            onCheckedChange={(checked) => onUpdate(id, fieldKey, checked)}
          />
          <span className="text-sm text-white">{fieldData ? "Yes" : "No"}</span>
        </div>
      );

    case "Color":
      return (
        <div className="flex items-center px-2">
          <input
            type="color"
            value={fieldData || "#000000"}
            onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
            className="w-5 h-6 bg-transparent rounded-full cursor-pointer"
          />
          <input
            className="flex-1 w-[100px] rounded-none px-3 py-2 text-sm bg-transparent text-white focus-visible:outline-none"
            type="text"
            value={fieldData || ""}
            onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
          />
        </div>
      )

    case "Number":
      return (
        <input
          className="w-full rounded-none px-3 py-2 text-sm bg-transparent text-white focus-visible:outline-none"
          type="number"
          value={fieldData || ""}
          onChange={(e) => {
            const numValue = e.target.value === "" ? "" : Number(e.target.value)
            onUpdate(id, fieldKey, numValue)
          }}
        />
      )

    case "RichText":
      return (
        <>
          <AlertDialog>
            <AlertDialogTrigger>
              <button className="w-full text-left rounded-none px-3 py-2 text-sm bg-transparent text-white hover:bg-gray-800">
                {fieldData ? (
                  <div className="truncate max-w-[200px]">
                    {typeof fieldData === "string" ? fieldData.substring(0, 50) : "Rich content..."}...
                  </div>
                ) : (
                  <span className="text-gray-400">Edit content...</span>
                )}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="p-0">
              <div className="relative">
                <RichTextField
                id={id}
                fieldData={fieldData || ""}
                fieldKey={fieldKey}
                onUpdate={onUpdate}
                key={fieldKey}
              />
              </div>
          <AlertDialogAction className="h-8 w-8 flex items-center justify-center absolute -right-6 -top-6 rounded-full">
            <IoMdClose />
          </AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        </>
        
      );

    case "File":
    case "ImageRef":
      const fileData = typeof fieldData === "object" ? fieldData : { url: fieldData }
      return (
        <div className="flex flex-col">
          <input
            className="w-[300px] rounded-none px-3 py-2 text-sm bg-transparent text-white focus-visible:outline-none"
            type="text"
            value={fileData.url || ""}
            onChange={(e) => {
              const newValue = { ...fileData, url: e.target.value }
              onUpdate(id, fieldKey, newValue)
            }}
            placeholder="Enter file URL"
          />
        </div>

      )

    case "VideoLink":
      const linkData = typeof fieldData === "object" ? fieldData : { url: fieldData }
      return (
        <div className="flex flex-col">
          <input
            className="w-[300px] rounded-none px-3 py-2 text-sm bg-transparent text-white focus-visible:outline-none"
            type="text"
            value={linkData.url || ""}
            onChange={(e) => {
              const newValue = { ...linkData, url: e.target.value }
              onUpdate(id, fieldKey, newValue)
            }}
            placeholder="Enter file URL"
          />
        </div>
        
      )

    case "Phone" :
      return (
        <input
          className="w-[150px] rounded-none px-3 py-2 text-sm bg-transparent text-white focus-visible:outline-none"
          type="text"
          value={typeof fieldData === "object" ? JSON.stringify(fieldData) : String(fieldData || "")}
          onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
        />
      )

    default:
    return (
      <input
        className="w-[250px] rounded-none px-3 py-2 text-sm bg-transparent text-white focus-visible:outline-none"
        type="text"
        value={typeof fieldData === "object" ? JSON.stringify(fieldData) : String(fieldData || "")}
        onChange={(e) => onUpdate(id, fieldKey, e.target.value)}
      />
    )
  }
}

export default RenderFieldInput



