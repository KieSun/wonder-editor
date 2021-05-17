import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/eclipse.css';

interface IEditorProps {
  handleEditorChange: (value: string) => void;
}

const Editor = (props: IEditorProps) => {
  const { handleEditorChange } = props;
  const [value, setValue] = useState('');

  const handleChange = useCallback((instance) => {
    const value = instance.getValue();
    setValue(value);
    handleEditorChange(value);
  }, []);

  const handleDrop = useCallback((instance, e) => {
    console.log(e.dataTransfer.files);
  }, []);

  return (
    <CodeMirror
      value={value}
      options={{
        theme: 'eclipse',
        keyMap: 'sublime',
        mode: 'markdown',
        lineWrapping: true,
        lineNumbers: false,
      }}
      onChange={handleChange}
      onDrop={handleDrop}
    />
  );
};

export default Editor;
