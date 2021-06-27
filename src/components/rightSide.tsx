import React from 'react';
import { Tooltip } from 'antd';
import { WechatOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { copy } from '@/utils/copy';

const StyledWrapper = styled.div`
  position: absolute;
  right: 40px;
  top: 120px;

  & > span {
    font-size: 20px;
    cursor: pointer;
  }
`;

export default () => {
  return (
    <StyledWrapper>
      <Tooltip title="复制至公众号" placement="left">
        <WechatOutlined
          style={{ color: 'rgb(4, 193, 96)' }}
          onClick={() => copy()}
        />
      </Tooltip>
    </StyledWrapper>
  );
};
