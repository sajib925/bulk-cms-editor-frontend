import {
  DecoratorNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";

type SerializedImageNode = Spread<
  {
    type: "image";
    version: 1;
    src: string;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;

  constructor(src: string, key?: string) {
    super(key);
    this.__src = src;
  }

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
    };
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <img
        src={this.__src}
        alt="Image"
        className="max-w-full h-auto rounded my-2"
      />
    );
  }
}

export function $createImageNode(src: string): ImageNode {
  return new ImageNode(src);
}
