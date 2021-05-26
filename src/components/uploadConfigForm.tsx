import { Modal, Form, Input, Select, FormInstance, message } from 'antd';
import { getUploadType, getConfig } from '@/utils/upload';
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
          ...getConfig(type, true),
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
            <Select.Option value="github">Github</Select.Option>
            <Select.Option value="alioss">阿里云</Select.Option>
          </Select>
        </Form.Item>
        {[UploadType.Gitee, UploadType.Github].includes(type) && (
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
        )}
        {type === UploadType.AliOss && (
          <>
            <Form.Item
              name="region"
              label="确认存储区域"
              rules={[{ required: true, message: '请输入确认存储区域' }]}
            >
              <Input placeholder="如：oss-cn-hangzhou" />
            </Form.Item>
            <Form.Item
              name="accessKeyId"
              label="设定AkId"
              rules={[{ required: true, message: '请设定AkId' }]}
            >
              <Input placeholder="AccessKeyId" />
            </Form.Item>
            <Form.Item
              name="accessKeySecret"
              label="设定SkId"
              rules={[{ required: true, message: '请设定SkId' }]}
            >
              <Input placeholder="AccessKeySecret" />
            </Form.Item>
            <Form.Item
              name="bucket"
              label="存储空间名"
              rules={[{ required: true, message: '请输入存储空间名' }]}
            >
              <Input placeholder="bucket名称" />
            </Form.Item>
            <Form.Item name="path" label="存储路径">
              <Input placeholder="指定存储路径，例如img/" />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};
