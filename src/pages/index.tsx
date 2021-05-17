import { useCallback, useState } from 'react';
import Editor from '@/components/editor';
import Header from '@/components/header';
import Preview from '@/components/preview';
import 'bytemd/dist/index.min.css';
import { StyledWrapper, StyledMainWrapper } from './styles';

export default function IndexPage() {
  const [value, setValue] = useState('');

  const handleEditorChange = useCallback((v) => {
    setValue(v);
  }, []);

  return (
    <StyledWrapper>
      <Header />
      <StyledMainWrapper>
        <Editor handleEditorChange={handleEditorChange} />
        <Preview value={value} />
      </StyledMainWrapper>
    </StyledWrapper>
  );
}
