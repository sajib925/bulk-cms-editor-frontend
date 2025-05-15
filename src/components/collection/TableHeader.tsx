import { ArrowDown, ArrowUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import EditIcon from "@/assets/EditIcon"

interface TableHeaderProps {
  allFieldKeys: string[]
  selectedIds: string[]
  paginatedItems: any[]
  sortKey: string | null
  sortOrder: "asc" | "desc"
  bulkEditColumn: string | null
  setSelectedIds: (ids: string[]) => void
  handleSort: (key: string) => void
  setBulkEditColumn: (column: string | null) => void
  setBulkEditValue: (value: string) => void
  getFieldIcon: (fieldSlug: string) => JSX.Element | null
}

const TableHeader = ({
  allFieldKeys,
  selectedIds,
  paginatedItems,
  sortKey,
  sortOrder,
  bulkEditColumn,
  setSelectedIds,
  handleSort,
  setBulkEditColumn,
  setBulkEditValue,
  getFieldIcon,
}: TableHeaderProps) => {
  return (
    <thead className="bg-[#2b2b2b] sticky top-0 z-10">
      <tr className="bg-transparent text-white">
        <th className="border border-[#444] p-2 text-center">
          <Checkbox
            checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedIds(paginatedItems.map((item) => item.id))
              } else {
                setSelectedIds([])
              }
            }}
            className="rounded-full"
          />
        </th>

        {allFieldKeys.map((key) => (
          <th key={key} className="border border-[#444444] py-2 px-3">
            <div className="flex justify-between items-center gap-1">
              <button onClick={() => handleSort(key)} className="flex items-center gap-1 ">
                {getFieldIcon(key)}
                <span>
                  {key === "lastUpdated"
                    ? "Last Updated"
                    : key === "createdOn"
                    ? "Created On"
                    : key}
                </span>
                {sortKey === key && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </button>
              {key !== "lastUpdated" && key !== "createdOn" && (
                <button
                  onClick={() => {
                    setBulkEditColumn(bulkEditColumn === key ? null : key)
                    setBulkEditValue("")
                  }}
                  className={`text-xs p-1 rounded ${
                    bulkEditColumn === key
                      ? "bg-[#006acc] text-white"
                      : "bg-transparent text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <EditIcon />
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default TableHeader

// import { ArrowDown, ArrowUp } from "lucide-react"
// import { Checkbox } from "@/components/ui/checkbox"
// import EditIcon from "@/assets/EditIcon"
// import SortableColumnHeader from "./SortableColumnHeader"

// interface TableHeaderProps {
//   columnOrder: string[]  // use this for order instead of allFieldKeys
//   selectedIds: string[]
//   paginatedItems: any[]
//   sortKey: string | null
//   sortOrder: "asc" | "desc"
//   bulkEditColumn: string | null
//   setSelectedIds: (ids: string[]) => void
//   handleSort: (key: string) => void
//   setBulkEditColumn: (column: string | null) => void
//   setBulkEditValue: (value: string) => void
//   getFieldIcon: (fieldSlug: string) => JSX.Element | null
// }

// const TableHeader = ({
//   columnOrder,
//   selectedIds,
//   paginatedItems,
//   sortKey,
//   sortOrder,
//   bulkEditColumn,
//   setSelectedIds,
//   handleSort,
//   setBulkEditColumn,
//   setBulkEditValue,
//   getFieldIcon,
// }: TableHeaderProps) => {
//   return (
//     <tr className="bg-[#2b2b2b] text-white sticky top-0 z-10">
//       <th className="border border-[#444] p-2 text-center w-[40px]">
//         <Checkbox
//           checked={selectedIds.length === paginatedItems.length && paginatedItems.length > 0}
//           onCheckedChange={(checked) => {
//             if (checked) {
//               setSelectedIds(paginatedItems.map((item) => item.id))
//             } else {
//               setSelectedIds([])
//             }
//           }}
//           className="rounded-full"
//         />
//       </th>

//       {columnOrder.map((key) => (
//         <SortableColumnHeader key={key} id={key}>
//           <th className="border border-[#444] py-2 px-3 cursor-pointer select-none">
//             <div className="flex justify-between items-center gap-1">
//               <button
//                 onClick={() => handleSort(key)}
//                 className="flex items-center gap-1 text-white"
//                 type="button"
//               >
//                 {getFieldIcon(key)}
//                 <span>
//                   {key === "lastUpdated"
//                     ? "Last Updated"
//                     : key === "createdOn"
//                     ? "Created On"
//                     : key}
//                 </span>
//                 {sortKey === key &&
//                   (sortOrder === "asc" ? (
//                     <ArrowUp size={14} />
//                   ) : (
//                     <ArrowDown size={14} />
//                   ))}
//               </button>

//               {key !== "lastUpdated" && key !== "createdOn" && (
//                 <button
//                   onClick={() => {
//                     setBulkEditColumn(bulkEditColumn === key ? null : key)
//                     setBulkEditValue("")
//                   }}
//                   className={`text-xs p-1 rounded ${
//                     bulkEditColumn === key
//                       ? "bg-[#006acc] text-white"
//                       : "bg-transparent text-gray-200 hover:bg-gray-700"
//                   }`}
//                   type="button"
//                 >
//                   <EditIcon />
//                 </button>
//               )}
//             </div>
//           </th>
//         </SortableColumnHeader>
//       ))}
//     </tr>
//   )
// }

// export default TableHeader
