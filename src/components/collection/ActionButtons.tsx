interface ActionButtonsProps {
  newItemsCount: number
  editedItemsCount: number
  selectedIdsCount: number
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  handleSaveNewItems: () => void
  handleSaveAll: () => void
  handleDeleteSelected: () => void
}

const ActionButtons = ({
  newItemsCount,
  editedItemsCount,
  selectedIdsCount,
  isCreating,
  isUpdating,
  isDeleting,
  handleSaveNewItems,
  handleSaveAll,
  handleDeleteSelected,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center justify-end gap-5">
      {newItemsCount > 0 && (
        <button
          onClick={handleSaveNewItems}
          disabled={isCreating}
          className={`px-4 py-1 rounded ${
            isCreating ? "bg-gray-700 text-gray-300 cursor-not-allowed" : "bg-[#006acc] text-white"
          }`}
        >
          {isCreating ? "Creating..." : "Save New Items"}
        </button>
      )}

      <button
        onClick={handleSaveAll}
        disabled={editedItemsCount === 0 || isUpdating}
        className={`px-4 py-1 rounded ${
          editedItemsCount === 0 || isUpdating
            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
            : "bg-[#006acc] text-white"
        }`}
      >
        {isUpdating ? "Saving..." : "Save"}
      </button>

      <button
        onClick={handleDeleteSelected}
        disabled={selectedIdsCount === 0 || isDeleting}
        className={`px-4 py-1 rounded ${
          selectedIdsCount === 0 || isDeleting
            ? "bg-gray-700 text-gray-300 cursor-not-allowed"
            : "bg-red-500 text-white"
        }`}
      >
        {isDeleting ? "Deleting..." : "Delete Selected"}
      </button>
    </div>
  )
}

export default ActionButtons
