import {
  $generateHtmlFromNodes,
  $generateNodesFromDOM,
} from "@lexical/html";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  HeadingNode,
  $createHeadingNode,
  QuoteNode,
  $createQuoteNode,
} from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  EditorState,
  LexicalEditor,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useEffect, useMemo, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  Bold,
  Italic,
  Underline,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Redo,
  Undo,
  Quote,
} from "lucide-react";

type RichTextFieldProps = {
  fieldData: string;
  id: string | number;
  fieldKey: string;
  onUpdate: (id: string, fieldKey: string, html: string) => void;
};

export default function RichTextField({
  fieldData,
  id,
  fieldKey,
  onUpdate,
}: RichTextFieldProps) {
  const [isEditorInitialized, setIsEditorInitialized] = useState(false);
  

  

 const initialEditorState = useMemo(() => {
    if (typeof fieldData === "string" && fieldData.trim().startsWith("<")) {
      return (editor: LexicalEditor) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(fieldData, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);

        editor.update(() => {
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        });
      };
    }
    return null;
  }, [fieldData]);

  useEffect(() => {
    setIsEditorInitialized(true);
  }, []);

  const editorConfig = {
    namespace: "RichTextEditor",
    theme: {
      paragraph: "mb-2",
      heading: {
        h1: "text-2xl font-bold",
        h2: "text-xl font-semibold",
        h3: "text-lg font-medium",
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
    },
    onError: (error: Error) => {
      console.error("Lexical error:", error);
    },
    editorState: initialEditorState ?? undefined,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <div className="h-[400px]">
      {isEditorInitialized && (
        <LexicalComposer initialConfig={editorConfig}>
          <RichTextToolbar />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="h-[350px] overflow-auto outline-none p-3 bg-[#1e1e1e] text-white border border-gray-600 rounded" />
            }
            placeholder={
              <div className="text-gray-500 p-3">Start typing here...</div>
            }
            ErrorBoundary={({ children }) => <>{children}</>}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <OnChangePlugin
            onChange={(editorState: EditorState, editor: LexicalEditor) => {
              editorState.read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                onUpdate(String(id), fieldKey, htmlString)
              });
            }}
          />
        </LexicalComposer>
      )}
    </div>
  );
}

function RichTextToolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 p-1 mb-2 border-b border-gray-700">
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
        onClick={formatParagraph}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Paragraph"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={formatQuote}
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Quote"
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div>

      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
        }
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
        }
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
        }
        className="p-1 text-gray-300 hover:bg-gray-700 rounded"
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>
    </div>
  );
}


          