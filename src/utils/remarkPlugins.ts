import { visit, Node, Visitor } from 'unist-util-visit';

export function linkToFootnotePlugin() {
  return {
    remark: (u: any) => {
      return u.use(() => transformer);
    },
  };
}

function transformer(tree: any) {
  let i = 1;
  const replace: Visitor<Node> = (node, index, parent) => {
    // @ts-ignore
    visit(node, 'text', (child) => {
      const identifier = i++;
      node.text = identifier;
      node.type = 'footnoteReference';
      node.identifier = identifier;
      parent?.children.splice(
        index!,
        0,
        {
          type: 'html',
          value: '<span class="sup_label">',
        },
        {
          type: 'text',
          value: child.value,
        },
        {
          type: 'html',
          value: '</span>',
        },
      );
      tree.children.push({
        type: 'footnoteDefinition',
        identifier,
        children: [
          {
            type: 'text',
            value: `${child.value}：${node.url}`,
          },
        ],
      });
    });
  };
  // @ts-ignore
  visit(tree, 'link', replace);
}
