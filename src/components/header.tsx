import { Menu, Divider, Row, Col, Dropdown, Button } from 'antd';
import { StyledHeader } from '@/components/header.styles';

export default () => {
  const menu = (
    <Menu>
      <Menu.Item>图床设置</Menu.Item>
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
    </StyledHeader>
  );
};
