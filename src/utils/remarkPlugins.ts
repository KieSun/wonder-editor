import visit, { Visitor } from 'unist-util-visit';
import { Node, Parent } from 'unist';
import QRCode from 'qrcode';

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
      const id = `qrcode_${identifier}`;
      setTimeout(async () => {
        const wrapper = document.querySelector(
          `#user-content-${id}`,
        )?.parentElement;
        if (wrapper) {
          wrapper.setAttribute('class', 'qrcode_wrapper');
          const svgWrapper = document.createElement('div');
          svgWrapper.innerHTML = await QRCode.toString(node.url as string, {
            color: {
              light: 'inherit',
            },
          });
          wrapper.append(svgWrapper);
        }
      });
      tree.children.splice(
        tree.children.findIndex((item: Parent | undefined) => item === parent) +
          1,
        0,
        {
          type: 'element',
          children: [
            {
              type: 'html',
              value: `<div id="${id}">`,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', value: '111123' }],
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', value: '11112312323' }],
            },
            {
              type: 'html',
              value: '</div>',
            },
          ],
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
