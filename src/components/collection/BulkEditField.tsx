import { FieldDefinition, Item } from "@/types"
import {  CalendarIcon, X } from "lucide-react"
import { Switch } from "../ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import RichTextField from "./RichTextField"

interface BulkEditFieldProps {
  fieldDefinition: FieldDefinition | undefined
  bulkEditValue: any
  isUpdating: Boolean | undefined
  setBulkEditValue: (value: any) => void
  handleBulkColumnUpdate: (value: any) => void
  referenceItems: Item[]
}

const BulkEditField = ({ fieldDefinition, bulkEditValue, setBulkEditValue, referenceItems, isUpdating, handleBulkColumnUpdate }: BulkEditFieldProps) => {
  if (!fieldDefinition) return null

  switch (fieldDefinition.type) {

    case "Reference":
      return (
        <div className="flex-1">
          <div className="bg-[#1e1e1e] text-white border border-gray-600 rounded p-2 flex items-center gap-2">
            <label className="block text-sm font-medium whitespace-nowrap">Select a reference</label>
            <Select
              value={bulkEditValue === "" ? "none" : bulkEditValue}
              onValueChange={(val) => setBulkEditValue(val === "none" ? "" : val)}
            >
              <SelectTrigger className="bg-[#1e1e1e] text-white border border-gray-600">
                <SelectValue placeholder="Select reference..." />
              </SelectTrigger>
              <SelectContent className="!bg-[#292929] text-white !rounded-b-sm border border-gray-600 max-h-[200px] overflow-y-auto">
                <SelectItem value="none">None</SelectItem>
                {referenceItems.map((refItem) => (
                  <SelectItem key={refItem.id} value={refItem.id}>
                    {refItem.fieldData.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium whitespace-nowrap">Select Multiple References:</label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {selectedValues.length > 0
                    ? `Selected (${selectedValues.length})`
                    : "Select references to apply"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1e1e1e] text-white border border-gray-600 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select References</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                  {referenceItems.map((refItem) => (
                    <div key={refItem.id} className="flex items-center">
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
                  <div className="mt-4 text-sm">
                    <div className="font-medium mb-1">Selected:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedValues.map((refId) => {
                        const refItem = referenceItems.find((item) => item.id === refId)
                        return (
                          <div
                            key={refId}
                            className="bg-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                          >
                            {refItem?.fieldData.name || refId}
                            <button
                              onClick={() => toggleReference(refId)}
                              className="text-gray-300 hover:text-white"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
              </DialogContent>
            </Dialog>
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
            <input
              className="w-full rounded px-3 py-2 text-sm bg-transparent text-white border focus-visible:outline-none border-gray-600"
              type="text"
              value={linkData.url || ""}
              onChange={(e) => {
                const newValue = { ...linkData, url: e.target.value }
                setBulkEditValue(newValue)
              }}
              placeholder="https://youtube.com/..."
            />
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
      
    case "RichText":
      return (
        <Dialog>
          <DialogTrigger>
            <button className="w-full text-left px-3 py-2 text-sm bg-transparent text-white rounded border-2 border-gray-800 hover:bg-gray-800">
              Update All Rich Text Fields
            </button>
          </DialogTrigger>
          <DialogContent className="p-0 min-w-[700px] !bg-[#292929] text-white !rounded-b-sm gap-0">
            <RichTextField
              id={fieldDefinition.slug} 
              fieldData={bulkEditValue || ""}
              fieldKey={fieldDefinition.slug}
              onUpdate={(id, key, value) => {
                setBulkEditValue(value) 
              }}
              key={fieldDefinition.slug}
            />
            <DialogFooter className="flex items-center justify-end gap-2 py-1 px-3 !rounded-b !bg-[#292929] mt-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="rounded !py-1 h-8 !bg-[#2f2f2f] border !border-gray-400">
                  Close
                </Button>
              </DialogClose>
              <button
                onClick={handleBulkColumnUpdate}
                // disabled={isUpdating}
                className={`px-4 py-1 ${
                  isUpdating
                    ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                    : "bg-[#006acc] text-white hover:bg-[#0055aa]"
                } rounded`}
              >
                {isUpdating ? "Applying..." : "Apply to All"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )


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

  case "PlainText":
      if (fieldDefinition.validations?.singleLine === false) {
        return (
          <textarea
            value={bulkEditValue || ""}
            onChange={(e) => setBulkEditValue(e.target.value)}
            placeholder={`Enter value for all ${fieldDefinition.slug} fields`}
            className="flex-1 px-3 py-2 w-[300px] h-[200px] bg-[#1e1e1e] text-white border border-gray-600 rounded resize-none focus-visible:outline-none"
          />
        )
      } else {
        return (
          <input
            type="text"
            value={bulkEditValue || ""}
            onChange={(e) => setBulkEditValue(e.target.value)}
            placeholder={`Enter value for all ${fieldDefinition.slug} fields`}
            className="flex-1 px-3 py-1 bg-[#1e1e1e] text-white border border-gray-600 rounded"
          />
        )
      }

  case "Color":
    return (
      <div className="flex-1">
        <div className="bg-[#1e1e1e] flex items-center justify-center gap-2 text-white border border-gray-600 rounded p-2">
          <label className="block font-medium">Pick a color:</label>
          <input
            type="color"
            value={bulkEditValue || "#000000"}
            onChange={(e) => setBulkEditValue(e.target.value)}
            className="w-5 h-6 p-0 border-none outline-none bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={bulkEditValue || "#000000"}
            onChange={(e) => setBulkEditValue(e.target.value)}
            className="text-sm bg-transparent border border-gray-500 rounded px-2 py-1 text-white w-28"
            placeholder="#000000"
          />
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
