import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableColumnHeaderProps {
  id: string
  children: React.ReactNode
}

const SortableColumnHeader = ({ id, children }: SortableColumnHeaderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border border-[#444] py-2 px-3 select-none bg-[#2b2b2b] text-white"
    >
      {children}
    </th>
  )
}

export default SortableColumnHeader
