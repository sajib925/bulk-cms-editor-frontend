import React from "react"
import {
  FileText,
  ImageIcon,
  Video,
  Link as LinkIcon,
  Mail,
  Phone,
  Hash,
  Calendar,
  Check,
  Palette,
} from "lucide-react"
import { FieldType } from "@/types"


interface FieldIconProps {
  type: FieldType
}

export const FieldIcon: React.FC<FieldIconProps> = ({ type }) => {
  const commonProps = { size: 14, className: "text-gray-400" }

  switch (type) {
    case "PlainText":
    case "RichText":
      return <FileText {...commonProps} />
    case "ImageRef":
      return <ImageIcon {...commonProps} />
    case "VideoLink":
      return <Video {...commonProps} />
    case "Link":
      return <LinkIcon {...commonProps} />
    case "Email":
      return <Mail {...commonProps} />
    case "Phone":
      return <Phone {...commonProps} />
    case "Number":
      return <Hash {...commonProps} />
    case "DateTime":
      return <Calendar {...commonProps} />
    case "Switch":
      return <Check {...commonProps} />
    case "Color":
      return <Palette {...commonProps} />
    default:
      return null
  }
}
