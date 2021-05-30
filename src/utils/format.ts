import prettier from 'prettier';
import markdownPlugin from 'prettier/parser-markdown';

export const formatMarkdown = (value: string) => {
  return prettier.format(value, {
    parser: 'markdown',
    plugins: [markdownPlugin],
  });
};
