import { useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { Form, Input, Typography } from 'antd';

import SubmitButton from '../../components/ui/SubmitButton';

import '../../css/resetPasswordStyle.css';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const handleResetPassword = () => {
    try {
      const data = form.getFieldValue();
      const dataCallAPI = {
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      console.log('DataCallAPI: ', dataCallAPI);
    } catch {
      console.log('Error');
    }
  };

  const [form] = Form.useForm();

  return (
    <div className="reset-password">
      <div className="title-reset-password">Reset mật khẩu</div>
      <Form
        form={form}
        name="normal_reset-password"
        className="reset-password-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Please input your Confirm Password!',
            },
            {
              validator: (_, value) => {
                if (!value || form.getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            },
          ]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>

        {error && (
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Typography.Text type="danger">{error}</Typography.Text>
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <SubmitButton
            form={form}
            type="primary"
            loading={loading}
            htmlType="submit"
            className="reset-password-form-button"
            onClick={handleResetPassword}
          >
            Reset
          </SubmitButton>
        </Form.Item>
      </Form>
    </div>
  );
}
