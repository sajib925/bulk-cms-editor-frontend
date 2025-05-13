import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaginationProps {
  pageSize: number
  currentPage: number
  totalItems: number
  setPageSize: (size: number) => void
  setCurrentPage: (page: number) => void
}

const Pagination = ({ pageSize, currentPage, totalItems, setPageSize, setCurrentPage }: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white">Items per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value))
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[80px] bg-[#1e1e1e] text-white !rounded-sm h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e1e] text-white">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {totalItems > pageSize && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-[#006acc] text-white" : "bg-gray-700 text-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Pagination
