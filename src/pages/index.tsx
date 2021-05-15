import Editor from '@/components/editor';
import Header from '@/components/header';
import Preview from '@/components/preview';
import 'bytemd/dist/index.min.css';
import { StyledWrapper, StyledMainWrapper } from './styles';

export default function IndexPage() {
  return (
    <StyledWrapper>
      <Header />
      <StyledMainWrapper>
        <Editor />
        <Preview />
      </StyledMainWrapper>
    </StyledWrapper>
  );
}
