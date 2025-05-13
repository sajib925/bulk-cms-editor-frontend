
//auto slug generate

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-") 
    .trim() 
}

export const cleanEmptyFields = (fields: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => {
      if (Array.isArray(value)) return true
      if (typeof value === "boolean") return true
      if (typeof value === "number") return true
      return value !== "" && value !== null && value !== undefined
    }),
  )
}