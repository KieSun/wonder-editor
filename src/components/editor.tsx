import { useState, useCallback, useEffect, useRef } from 'react';
import { Editor } from '@bytemd/react';
import footnotes from '@bytemd/plugin-footnotes';
// @ts-ignore
import zhHans from 'bytemd/lib/locales/zh_Hans.json';
import CodeMirror from 'codemirror';
import { emit, useEventbus } from 'react-wonder-hooks';
import styled, { css } from 'styled-components';
import { Menu } from 'antd';
import keydown from '@/common/keyCode';
import upload from '@/utils/upload';
import { formatMarkdown } from '@/utils/format';
import { Notify } from '@/common/constant';
import {
  linkToFootnotePlugin,
  divToSectionPlugin,
} from '@/utils/remarkPlugins';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import 'highlight.js/styles/vs.css';
import RightSide from './rightSide';

interface IEditorProps {
  handleEditorChange: (value: string) => void;
}

interface IMenuInfo {
  show: boolean;
  x?: number;
  y?: number;
}

const StyledMenuWrapper = styled.div<{ left: number; top: number }>`
  ${(props) => {
    return css`
      position: absolute;
      left: ${props.left}px;
      top: ${props.top}px;
      width: 150px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 4px 8px 0 rgb(0 0 0 / 12%), 0 2px 4px 0 rgb(0 0 0 / 8%);
      z-index: 9999;
    `;
  }}
`;

export default (props: IEditorProps) => {
  const { handleEditorChange } = props;
  const [value, setValue] = useState('');
  const [editor, setEditor] = useState<CodeMirror.Editor>();
  const [menuInfo, setMenuInfo] = useState<IMenuInfo>({ show: false });
  const [pluginParams, setPluginParams] = useState({
    linkToHTML: true,
    linkToQRCode: false,
  });

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
    const keydownListener = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey } = event;
      if (key === keydown.S && (ctrlKey || metaKey)) {
        event.preventDefault();
        handleFormatter();
      }
    };
    const contextmenuListener = (e: any) => {
      setMenuInfo({
        show: true,
        x: e.clientX,
        y: e.clientY,
      });
      e.preventDefault();
    };
    const clickListener = () => {
      setMenuInfo({
        show: false,
      });
    };
    document.addEventListener('keydown', keydownListener);
    document.addEventListener('click', clickListener);
    document
      .querySelector('.bytemd-editor')
      ?.addEventListener('contextmenu', contextmenuListener);
    return () => {
      document.removeEventListener('keydown', keydownListener);
      document.removeEventListener('click', clickListener);
      document
        .querySelector('.bytemd-editor')
        ?.removeEventListener('contextmenu', contextmenuListener);
    };
  }, [handleFormatter]);

  useEffect(() => {
    const instance = (document.querySelector('.CodeMirror') as any)?.CodeMirror;
    setEditor(instance);
  }, []);

  useEventbus(Notify.FormatDoc, handleFormatter, [handleFormatter]);
  useEventbus(
    Notify.LinkToQRCode,
    (checked: boolean) =>
      setPluginParams((params) => ({
        ...params,
        linkToQRCode: !params.linkToQRCode,
      })),
    [],
  );
  useEventbus(
    Notify.LinkToHTML,
    (checked: boolean) => {
      return setPluginParams((params) => ({
        ...params,
        linkToHTML: !params.linkToHTML,
      }));
    },
    [],
  );

  return (
    <>
      <Editor
        mode="split"
        value={value}
        locale={zhHans}
        plugins={[
          gfm(),
          highlight(),
          linkToFootnotePlugin({ ...pluginParams }),
          divToSectionPlugin(),
          footnotes(),
        ]}
        uploadImages={handleUploadImages}
        onChange={handleChange}
      />
      <RightSide />
      {menuInfo.show ? (
        <StyledMenuWrapper left={menuInfo.x!} top={menuInfo.y!}>
          <Menu>
            <Menu.Item onClick={() => emit(Notify.FormatDoc)}>
              格式化文档
            </Menu.Item>
          </Menu>
        </StyledMenuWrapper>
      ) : null}
    </>
  );
};
