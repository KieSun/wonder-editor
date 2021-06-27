import { useState } from 'react';
import { Button, Col, Divider, Dropdown, Menu, Row, Switch } from 'antd';
import { emit } from 'react-wonder-hooks';
import { StyledHeader } from '@/components/header.styles';
import UploadConfigForm from './uploadConfigForm';
import { Notify } from '@/common/constant';

export default () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const menu = (
    <Menu>
      <Menu.Item onClick={() => setShowUploadDialog((v) => !v)}>
        图床设置
      </Menu.Item>
      <Menu.Item onClick={() => emit(Notify.FormatDoc)}>格式化文档</Menu.Item>
    </Menu>
  );

  return (
    <StyledHeader>
      <Row align="middle" justify="center">
        <Col>
          <Dropdown overlay={menu}>
            <Button type="text" size="large">
              功能
            </Button>
          </Dropdown>
        </Col>
        <Col style={{ paddingRight: '15px' }}>
          <Switch
            checkedChildren="链接转脚注"
            unCheckedChildren="关闭链接转脚注"
            defaultChecked
            onChange={(checked) => emit(Notify.LinkToHTML, checked)}
          />
        </Col>
        <Col>
          <Switch
            checkedChildren="链接转二维码"
            unCheckedChildren="关闭链接转二维码"
            onChange={(checked) => emit(Notify.LinkToQRCode, checked)}
          />
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
