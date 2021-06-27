import juice from 'juice';
import { baseTheme } from '@/pages/styles';
import { message } from 'antd';

export const inlineStyleOfHTML = () => {
  const element = document.querySelector('.bytemd-preview');
  if (element) {
    return juice.inlineContent(element.innerHTML, baseTheme.toString(), {
      inlinePseudoElements: true,
      preserveImportant: true,
    });
  }
  return '';
};

export function solveImg() {
  const preview = document.querySelector('.markdown-body');
  const images = preview!.getElementsByTagName('img');
  for (const image of images) {
    const width = image.getAttribute('width') || '100%';
    const height = image.getAttribute('height') || '100%';
    image.removeAttribute('width');
    image.removeAttribute('height');
    image.style.width = width;
    image.style.height = height;
    const parentElement = image.parentElement;
    if (parentElement) parentElement.style.textAlign = 'center';
  }
}

export function copy() {
  const preview = document.querySelector('.markdown-body');
  if (preview && preview.firstChild && preview.lastChild) {
    window.getSelection()?.removeAllRanges();
    const originalHTML = preview.innerHTML;
    preview.innerHTML = inlineStyleOfHTML();
    solveImg();
    let range = document.createRange();
    range.setStartBefore(preview.firstChild);
    range.setEndAfter(preview.lastChild);
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
    preview.innerHTML = originalHTML;
    message.success('复制成功');
  }
}
