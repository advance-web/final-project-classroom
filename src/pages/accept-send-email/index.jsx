import { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Form, Input, Typography, Popover } from "antd";

import SubmitButton from "../../components/ui/SubmitButton";
import "../../css/acceptSendEmailStyle.css";
import { acceptSendEmail } from "../../services/auth";

export default function AcceptToSentEmailResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleAcceptToSendEmail = async () => {
    try {
      // Get the email from the form
      const data = await form.getFieldValue();
      await acceptSendEmail(data);

      // Optionally, you can perform additional actions after the email is sent
      console.log("Email sent successfully!");
    } catch (error) {
      // Handle any validation errors or other issues
      console.error("Error handling form submission:", error);
    }
  };

  return (
    <div className="accept-send-email">
      <div className="title-accept-send-email">Lấy lại mật khẩu</div>
      <div className="container-accept-send-email">
        <div className="content-accept-send-email">
          Vui lòng nhập email mà bạn đã đăng kí tài khoản với hệ thống của chúng
          tôi
        </div>
      </div>
      <Form
        form={form}
        name="normal_accept-send-email"
        className="accept-send-email-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>

        {error && (
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Typography.Text type="danger">{error}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Popover
            title="Mời bạn check email"
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <SubmitButton
              form={form}
              type="primary"
              loading={loading}
              htmlType="submit"
              className="accept-send-email-form-button"
              onClick={handleAcceptToSendEmail}
            >
              Gửi email xác nhận
            </SubmitButton>
          </Popover>
        </Form.Item>
      </Form>
    </div>
  );
}
