import { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/eclipse.css';

const Editor = () => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((instance) => {
    setValue(instance.getValue());
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
