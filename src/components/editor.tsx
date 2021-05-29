import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@bytemd/react';
import footnotes from '@bytemd/plugin-footnotes';
// @ts-ignore
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import CodeMirror from 'codemirror';
import prettier from 'prettier';
import markdownPlugin from 'prettier/parser-markdown';
import { fileToBase64, uploadFile } from '@/utils/upload';
import keydown from '@/common/keyCode';

interface IEditorProps {
  handleEditorChange: (value: string) => void;
}

export default (props: IEditorProps) => {
  const { handleEditorChange } = props;
  const [value, setValue] = useState('');
  const [editor, setEditor] = useState<CodeMirror.Editor>();

  const handleChange = useCallback((value: string) => {
    setValue(value);
    handleEditorChange(value);
  }, []);

  const handleFormatter = useCallback(() => {
    const formattedValue = prettier.format(value, {
      parser: 'markdown',
      plugins: [markdownPlugin],
    });
    handleChange(formattedValue);
    setTimeout(() => {
      if (editor) {
        const line = editor.lastLine() - 1;
        editor?.setCursor(line, editor.getLineTokens(line).length);
      }
    });
  }, [value, handleChange, editor]);

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

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const { keyCode, ctrlKey, metaKey } = event;
      if (keyCode === keydown.S && (ctrlKey || metaKey)) {
        event.preventDefault();
        handleFormatter();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleFormatter]);

  useEffect(() => {
    const instance = (document.querySelector('.CodeMirror') as any)?.CodeMirror;
    setEditor(instance);
  }, []);

  return (
    <Editor
      mode="split"
      value={value}
      locale={zhHans}
      plugins={[footnotes()]}
      uploadImages={handleUploadImages}
      onChange={handleChange}
    />
  );
};
