import { BadgePlus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Collection } from "@/types"

interface CollectionSelectorProps {
  collections: Collection[]
  selectedCollectionId: string
  searchQuery: string
  lastUpdatedFilter: string
  setSelectedCollectionId: (id: string) => void
  setSearchQuery: (query: string) => void
  setLastUpdatedFilter: (value: string) => void
  handleAddNewItem: () => void
}

const CollectionSelector = ({
  collections, 
  selectedCollectionId,
  searchQuery,
  lastUpdatedFilter,
  setSelectedCollectionId,
  setSearchQuery,
  setLastUpdatedFilter,
  handleAddNewItem,
}: CollectionSelectorProps) => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <Select value={selectedCollectionId} onValueChange={setSelectedCollectionId}>
        <SelectTrigger className="w-[170px] !py-[6px] bg-transparent !border !border-[#444] text-white rounded-sm">
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

      <Select value={lastUpdatedFilter} onValueChange={setLastUpdatedFilter}>
        <SelectTrigger className="w-[150px] !py-[6px] bg-transparent !border !border-[#444] !rounded-sm text-white">
          <SelectValue placeholder="Filter by update" />
        </SelectTrigger>
        <SelectContent className="bg-[#1e1e1e] text-white rounded-sm">
          <SelectItem value="2d">Last 2 days</SelectItem>
          <SelectItem value="10d">Last 10 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="1m">Last month</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-2 py-1 border border-[#444] rounded bg-transparent text-white focus-visible:outline-none"
        />

        <button
          onClick={handleAddNewItem}
          disabled={!selectedCollectionId}
          className={`px-4 py-1 rounded flex items-center justify-center gap-2 ${
            !selectedCollectionId
              ? "bg-gray-500 text-gray-300 cursor-not-allowed"
              : "bg-[#006acc] text-white"
          }`}
        >
          New
          <BadgePlus size={16} />
        </button>
      </div>
    </div>
  )
}

export default CollectionSelector
