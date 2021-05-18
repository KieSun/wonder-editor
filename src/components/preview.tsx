import { StyledPreviewWrapper } from './preview.styles';
import marked from 'marked';

interface IPreviewProps {
  value: string;
}

export default (props: IPreviewProps) => {
  const { value } = props;
  return (
    <StyledPreviewWrapper
      dangerouslySetInnerHTML={{
        __html: `<div class="preview">${marked(value)}</div>`,
      }}
    />
  );
};
