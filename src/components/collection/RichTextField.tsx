import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { HeadingNode, $createHeadingNode, QuoteNode, $createQuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { LinkNode, TOGGLE_LINK_COMMAND, $isLinkNode} from "@lexical/link"
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  type EditorState,
  type LexicalEditor,
  $insertNodes,
  
} from "lexical"
import { $setBlocksType } from "@lexical/selection"
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from "lexical"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { useEffect, useMemo, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Redo,
  Undo,
  Quote,
  Link,
  Image,
  Video,
} from "lucide-react"
import { $createImageNode, ImageNode } from "./nodes/ImageNode"
import { $createVideoNode, VideoNode } from "./nodes/VideoNode"

type RichTextFieldProps = {
  fieldData: string
  id: string | number
  fieldKey: string
  onUpdate: (id: string, fieldKey: string, html: string) => void
}

export default function RichTextField({ fieldData, id, fieldKey, onUpdate }: RichTextFieldProps) {
  const [isEditorInitialized, setIsEditorInitialized] = useState(false)

  const initialEditorState = useMemo(() => {
    if (typeof fieldData === "string" && fieldData.trim().startsWith("<")) {
      return (editor: LexicalEditor) => {
        const parser = new DOMParser()
        const dom = parser.parseFromString(fieldData, "text/html")
        const nodes = $generateNodesFromDOM(editor, dom)

        editor.update(() => {
          const root = $getRoot()
          root.clear()
          root.append(...nodes)
        })
      }
    }
    return null
  }, [fieldData])

  useEffect(() => {
    setIsEditorInitialized(true)
  }, [])

  const editorConfig = {
    namespace: "RichTextEditor",
    theme: {
      paragraph: "mb-2",
      heading: {
        h1: "text-2xl font-bold",
        h2: "text-xl font-semibold",
        h3: "text-lg font-medium",
        h4: "text-md font-medium",
        h5: "text-sm font-medium",
        h6: "text-xsm font-medium",
      },
      list: {
        nested: {
          listitem: "ml-6",
        },
        ol: "list-decimal ml-4",
        ul: "list-disc ml-4",
        listitem: "mb-1",
      },
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline",
        code: "bg-gray-800 text-green-300 px-1 py-0.5 rounded text-sm font-mono",
      },
      link: "text-blue-400 underline cursor-pointer",
    },
    onError: (error: Error) => {
      console.error("Lexical error:", error)
    },
    editorState: initialEditorState ?? undefined,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode, ImageNode, VideoNode],
  }

  return (
    <div className="h-[390px]">
      {isEditorInitialized && (
        <LexicalComposer initialConfig={editorConfig}>
          <RichTextToolbar />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="h-[350px] overflow-auto outline-none p-3 bg-[#1e1e1e] text-white border border-gray-600 rounded" />
            }
            // placeholder={<div className="text-gray-500 p-3">Start typing here...</div>}
            ErrorBoundary={({ children }) => <>{children}</>}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin
            onChange={(editorState: EditorState, editor: LexicalEditor) => {
              editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null)
                onUpdate(String(id), fieldKey, htmlString)
              })
            }}
          />
        </LexicalComposer>
      )}
    </div>
  )
}

function RichTextToolbar() {
  const [editor] = useLexicalComposerContext()
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [isEditingLink, setIsEditingLink] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const insertImage = () => {
    if (imageUrl) {
      editor.update(() => {
        const imageNode = $createImageNode(imageUrl);
        console.log(imageNode);
        
        $insertNodes([imageNode]);
      });
      setIsImageModalOpen(false);
      setImageUrl("");
    }
  };

  const insertVideo = () => {
    if (videoUrl) {
      editor.update(() => {
        const videoNode = $createVideoNode(videoUrl);
        $insertNodes([videoNode]);
      });
      setIsVideoModalOpen(false);
      setVideoUrl("");
    }
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }
  
  const confirmLink = () => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)
      setIsLinkModalOpen(false)
      setLinkUrl("")
      setLinkText("")
    }
  }
  const insertLink = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes()
        const linkNode = nodes.find((node) => $isLinkNode(node))

        if (linkNode) {
          setIsEditingLink(true)
          setLinkUrl(linkNode.getURL())
          setLinkText(selection.getTextContent())
        } else {
          setIsEditingLink(false)
          setLinkUrl("")
          setLinkText(selection.getTextContent())
        }

        setIsLinkModalOpen(true)
      }
    })
  }


  return (
    <div className="flex flex-wrap gap-1 p-1 mb-1 border-b border-gray-700">
      <button
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Undo"
      >
        <Undo size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Redo"
      >
        <Redo size={16} />
      </button>
      <div className="w-px h-6 bg-gray-700 mx-1"></div>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Underline"
      >
        <Underline size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Code"
      >
        <Code size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div>

      <button
        onClick={() => formatHeading("h1")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
        onClick={() => formatHeading("h2")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>
      <button
        onClick={() => formatHeading("h3")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Heading 3"
      >
        <Heading3 size={16} />
      </button>
      <button
        onClick={() => formatHeading("h4")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Heading 4"
      >
        <Heading4 size={16} />
      </button>
      <button
        onClick={() => formatHeading("h5")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Heading 5"
      >
        <Heading5 size={16} />
      </button>
      <button
        onClick={() => formatHeading("h6")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Heading 6"
      >
        <Heading6 size={16} />
      </button>
      <button onClick={formatParagraph} className="p-1 text-gray-300 hover:bg-gray-700 rounded" title="Paragraph">
        <AlignLeft size={16} />
      </button>
      <button onClick={formatQuote} className="p-1 text-gray-300 hover:bg-gray-700 rounded" title="Quote">
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div>

      <button
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div>
      
      <button onClick={insertLink} className="p-1 text-gray-300 hover:bg-gray-700 rounded" title="Insert Link">
        <Link size={16} />
      </button>
      <button
        onClick={() => setIsImageModalOpen(true)}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Insert Image"
      >
        <Image size={16} />
      </button>
      <button
        onClick={() => setIsVideoModalOpen(true)}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Insert Video"
      >
        <Video size={16} />
      </button>

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg w-80">
            <h3 className="text-white text-lg mb-4">{isEditingLink ? "Edit Link" : "Insert Link"}</h3>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="https://example.com"
                autoFocus
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-gray-300 mb-1">Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="Link text"
                disabled
              />
            </div> */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button onClick={confirmLink} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                {isEditingLink ? "Update" : "Insert"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg w-80">
            <h3 className="text-white text-lg mb-4">Insert Image</h3>
            <div className="mb-4">
              <label className="block text-gray-300 mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={insertImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg w-80">
            <h3 className="text-white text-lg mb-4">Insert Video</h3>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 mb-4"
              placeholder="https://example.com/video.mp4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={insertVideo}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
