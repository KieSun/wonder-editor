import { visit, Node, Visitor, SKIP } from 'unist-util-visit';

export function linkToFootnote() {
  return transformer;
}

function transformer(tree: Node) {
  const replace: Visitor<Node> = (node, index, parent) => {
    return [SKIP, index as number];
  };

  visit(tree, ['link'], replace);
}
