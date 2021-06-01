import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@bytemd/react';
import footnotes from '@bytemd/plugin-footnotes';
// @ts-ignore
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import CodeMirror from 'codemirror';
import { useEventbus } from 'react-wonder-hooks';
import keydown from '@/common/keyCode';
import upload from '@/utils/upload';
import { formatMarkdown } from '@/utils/format';
import { Notify } from '@/common/constant';

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
    handleChange(formatMarkdown(value));
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
        let url = '';
        if (upload.verifyImage(file)) {
          url = (await upload.uploadFile(file, name)) || '';
        }
        return {
          url,
        };
      }),
    );
  }, []);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event;
      if (key === keydown.S && (ctrlKey || metaKey)) {
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

  useEventbus(Notify.FormatDoc, handleFormatter, [handleFormatter]);

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
