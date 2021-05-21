import { useState, useCallback } from 'react';
import { Editor } from '@bytemd/react';
import footnotes from '@bytemd/plugin-footnotes';
// @ts-ignore
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import { fileToBase64, uploadFile } from '@/utils/upload';

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
        const content = await fileToBase64(file);
        if (!content) {
          return {
            url: '',
            title: '',
            alert: '',
          };
        }
        const url = await uploadFile(content, name);
        return {
          url,
          title: name,
          alert: '',
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
