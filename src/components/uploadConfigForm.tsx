import { Modal, Form, Input, Select, FormInstance, message } from 'antd';
import { getUploadType } from '@/utils/upload';
import { UploadType } from '@/common/constant';
import { useCallback, useRef, useState } from 'react';
import { UPLOADCONFIGKEY } from '@/common/constant';
import { IUploadConfig } from '@/types';

interface IUploadConfigFormProps {
  handleCancel: () => void;
  visible: boolean;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

export default (props: IUploadConfigFormProps) => {
  const { handleCancel, visible } = props;
  const [type, setType] = useState(getUploadType());
  const formRef = useRef<FormInstance>(null);

  const handleValuesChange = useCallback((changedFields) => {
    Object.keys(changedFields).forEach((key) => {
      if (key === 'type') {
        setType(changedFields[key]);
      }
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    await formRef.current?.validateFields();
    localStorage.setItem(
      UPLOADCONFIGKEY,
      JSON.stringify(formRef.current!.getFieldsValue()),
    );
    message.success('设置成功');
    handleCancel();
  }, [formRef]);

  return (
    <Modal
      title="图床设置"
      onCancel={handleCancel}
      onOk={handleSubmit}
      visible={visible}
    >
      <Form<IUploadConfig>
        {...layout}
        ref={formRef}
        labelAlign="left"
        initialValues={{
          ...JSON.parse(localStorage.getItem(UPLOADCONFIGKEY) as string),
          type,
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="type"
          label="图床"
          tooltip="默认图床定期清理数据，推荐自行配置"
        >
          <Select>
            <Select.Option value="default">默认</Select.Option>
            <Select.Option value="gitee">Gitee</Select.Option>
          </Select>
        </Form.Item>
        {type !== UploadType.Default ? (
          <>
            <Form.Item
              name="token"
              label="Token"
              rules={[{ required: true, message: '请输入 token' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="repo"
              label="Repo"
              rules={[{ required: true, message: '请输入仓库名' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="userName"
              label="UserName"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input />
            </Form.Item>
          </>
        ) : null}
      </Form>
    </Modal>
  );
};
