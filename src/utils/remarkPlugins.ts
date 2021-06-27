import visit, { Visitor } from 'unist-util-visit';
import { Node, Parent } from 'unist';
import QRCode from 'qrcode';

export function linkToFootnotePlugin() {
  return {
    remark: (u: any) => {
      return u.use(() => transformer);
    },
    rehype: (r) => {
      return r.use(() => handleHTML);
    },
  };
}

export function divToSectionPlugin() {
  return {
    rehype: (u: any) => {
      return u.use(() => handleHTML);
    },
  };
}

function transformer(tree: any) {
  let i = 1;
  const replace: Visitor<Node> = (node, index, parent) => {
    if (!node.title) return;
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

      tree.children.splice(
        tree.children.findIndex((item: Parent | undefined) => item === parent) +
          1,
        0,
        {
          type: 'html',
          value: `<div class='qrcode_wrapper qrcode_${identifier}'><div><p>${child.value}</p><p>${node.url}</p></div></div>`,
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

      setTimeout(async () => {
        const wrapper = document.querySelector(`.qrcode_${identifier}`);
        if (wrapper) {
          const svgWrapper = document.createElement('section');
          svgWrapper.innerHTML = await QRCode.toString(node.url as string, {
            color: {
              light: 'inherit',
            },
          });
          wrapper.append(svgWrapper);
        }
      });
    });
  };
  // @ts-ignore
  visit(tree, 'link', replace);
}

function handleHTML(tree: any) {
  visit(tree, 'element', (node) => {
    if (node.tagName === 'div') {
      node.tagName = 'section';
    }
  });
}
