import { useCallback, useState } from 'react';
import Editor from '@/components/editor';
import Header from '@/components/header';
import 'bytemd/dist/index.min.css';
import 'antd/dist/antd.css';
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
      </StyledMainWrapper>
    </StyledWrapper>
  );
}
