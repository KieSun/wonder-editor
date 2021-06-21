import juice from 'juice';
import { baseTheme } from '@/pages/styles';

export const inlineStyleOfHTML = () => {
  const element = document.querySelector('.bytemd-preview');
  if (element) {
    return juice.inlineContent(element.innerHTML, baseTheme, {
      inlinePseudoElements: true,
      preserveImportant: true,
    });
  }
  return '';
};

export function solveImg() {
  const preview = document.querySelector('.temporary-textarea');
  const images = preview!.getElementsByTagName('img');
  console.log('images =>', images);
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
