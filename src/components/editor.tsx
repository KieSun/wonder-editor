import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@bytemd/react';
import footnotes from '@bytemd/plugin-footnotes';
// @ts-ignore
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import { fileToBase64, uploadFile } from '@/utils/upload';
import keydown from '@/common/keyCode';

interface IEditorProps {
  handleEditorChange: (value: string) => void;
}

export default (props: IEditorProps) => {
  const { handleEditorChange } = props;
  const [value, setValue] = useState('');

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      const { keyCode, ctrlKey, metaKey } = event;
      if (keyCode === keydown.S && (ctrlKey || metaKey)) {
        event.preventDefault();
      }
    });
  }, []);

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
        const url = (await uploadFile(file, content)) || '';
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
