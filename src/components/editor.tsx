import { useState, useCallback } from 'react';
import { Editor } from '@bytemd/react';
import footnotes from '@bytemd/plugin-footnotes';
// @ts-ignore
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import upload from '@/utils/upload';

interface IEditorProps {
  handleEditorChange: (value: string) => void;
}

export default (props: IEditorProps) => {
  const { handleEditorChange } = props;
  const [value, setValue] = useState('');

  const handleChange = useCallback((instance) => {
    const value = instance.getValue();
    setValue(value);
    handleEditorChange(value);
  }, []);

  const handleUploadImages = useCallback((files: File[]) => {
    return Promise.all(
      files.map(async (file) => {
        const { name } = file;
        const url = (await upload.uploadFile(file, name)) || '';
        return {
          url,
          title: name,
          alert: name,
        };
      }),
    );
  }, []);

  return (
    <Editor
      mode="split"
      value={value}
      locale={zhHans}
      plugins={[footnotes()]}
      uploadImages={handleUploadImages}
      onChange={(v) => {
        setValue(v);
      }}
    />
  );
};
