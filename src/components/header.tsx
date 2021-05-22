import { useState } from 'react';
import { Menu, Divider, Row, Col, Dropdown, Button } from 'antd';
import { StyledHeader } from '@/components/header.styles';
import UploadConfigForm from './uploadConfigForm';

export default () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setShowUploadDialog((v) => !v)}>
        图床设置
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledHeader>
      <Row align="middle">
        <Col>
          <Dropdown overlay={menu}>
            <Button type="text" size="large">
              功能
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Divider />
      <UploadConfigForm
        visible={showUploadDialog}
        handleCancel={() => setShowUploadDialog((v) => !v)}
      />
    </StyledHeader>
  );
};
