
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

// src/lib/htmlUtils.ts

export const stripHtml = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

type SetNewItemsType = React.Dispatch<React.SetStateAction<Record<string, any>>>;

export const handleDuplicateItem = (
  originalId: string,
  setNewItems: SetNewItemsType
) => {
  const tempId = `dup-${Date.now()}`;

  setNewItems((prev) => {
    const itemToDuplicate = prev[originalId];
    if (!itemToDuplicate) return prev;

    const duplicatedItem = { ...itemToDuplicate };

    return {
      ...prev,
      [tempId]: duplicatedItem,
    };
  });
};
