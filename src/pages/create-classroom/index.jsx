import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Typography } from 'antd';

import SubmitButton from '../../components/ui/SubmitButton';
import AuthContext from '../../contexts/auth/auth-context';
import { createClassroom } from '../../services/classroom';

import '../../css/signupStyle.css';

export default function CreateClassroom() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  console.log('User: ', user);

  const handleCreateClassroom = async () => {
    try {
      const { classroomName, subjectName, maxStudent, description } = form.getFieldValue();
      const dataCallAPI = {
        name: classroomName,
        subject: subjectName,
        maxStudent: maxStudent,
        description: description,
      };

      console.log(dataCallAPI);
      setError(null);
      const dataRespond = await createClassroom(dataCallAPI);
      setLoading(false);
      console.log(dataRespond);

      if (dataRespond.data.status == 'success') {
        navigate('/create-classroom');
      }

      form.submit();
    } catch (error) {
      console.log('Error');
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  return (
    <div className="signup">
      <div className="title-signup">Tạo phòng học</div>
      <Form
        form={form}
        name="normal_signup"
        className="signup-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Classroom Name"
          name="classroomName"
          rules={[
            {
              required: true,
              message: 'Please input classroom name!',
            },
          ]}
        >
          <Input size="large" placeholder="Classroom Name" />
        </Form.Item>

        <Form.Item
          label="Subject Name"
          name="subjectName"
          rules={[
            {
              required: true,
              message: 'Please input subject name!',
            },
          ]}
        >
          <Input size="large" placeholder="Subject Name" />
        </Form.Item>

        <Form.Item
          label="Maximum students"
          name="maxStudent"
          rules={[
            {
              required: true,
              message: 'Please input your maximum number of student for classroom!',
            },
          ]}
        >
          <InputNumber size="large" min={1} max={10000} defaultValue={1} />
        </Form.Item>

        <Form.Item
          label="Classroom Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please input your description for classroom!',
            },
          ]}
        >
          <Input.TextArea size="large" placeholder="Classroom description" style={{ height: 150 }} />
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
            className="signup-form-button"
            onClick={handleCreateClassroom}
          >
            Tạo lớp học
          </SubmitButton>
        </Form.Item>
      </Form>
    </div>
  );
}
