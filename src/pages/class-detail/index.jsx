import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input } from 'antd';

import SubMenu from '../../components/shared/subMenu';
import { getDetailClassroomById } from '../../services/classroom';

function ClassDetail() {
  //const [loading, setLoading] = useState(false);
  const [detailClass, setDetailClass] = useState();
  const location = useLocation();
  console.log('Location: ', location);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const idClass = location.pathname.split('/').pop();
  console.log('ID Class: ', idClass);

  //setLoading(true);
  const handleUpdateClassroom = () => {
    console.log('Updated classroom');
  };

  useEffect(() => {
    const getDetailClassroom = async (id) => {
      const dataRespond = await getDetailClassroomById(id);
      console.log(dataRespond);
      setDetailClass(dataRespond.data.data);
    };

    getDetailClassroom(idClass);
  }, []);

  console.log('Detail class: ', detailClass);

  //setLoading(false);
  const [form] = Form.useForm();

  return (
    <>
      <SubMenu></SubMenu>
      <Card>
        <div
          className="bg-image"
          style={{
            backgroundImage: 'url(/img/AnhNen.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '240px',
            left: 0,
            position: 'relative',
            top: '0px',
            width: '100%',
            borderRadius: '8px',
          }}
        >
          <h1
            className="course-name"
            style={{
              bottom: 0,
              color: '#fff',
              left: 0,
              padding: '1rem 1.5rem',
              position: 'absolute',
              right: 0,
            }}
          >
            {detailClass?.name}
          </h1>
        </div>

        <div className="course-info">
          <h1>Thông tin về khóa học</h1>
          <Form
            form={form}
            name="normal_user-profile"
            className="user-profile-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{
              classroom: detailClass?.name,
              subject: detailClass?.subject,
              maxStudent: detailClass?.maxStudent,
              description: detailClass?.description,
            }}
            style={{ maxWidth: 600, marginLeft: '8rem' }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Tên lớp học"
              name="classroom"
              rules={[
                {
                  required: true,
                  message: 'Please input your classroom name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter classroom name" readOnly value={detailClass?.name} />
            </Form.Item>

            <Form.Item
              label="Tên môn học"
              name="subject"
              rules={[
                {
                  required: true,
                  message: 'Please input your subject name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter subject name" readOnly />
            </Form.Item>

            <Form.Item
              label="Số lượng học sinh"
              name="maxStudent"
              rules={[
                {
                  required: true,
                  message: 'Please input your number of student!',
                },
              ]}
            >
              <Input type="number" size="large" placeholder="Enter number of student" readOnly />
            </Form.Item>

            <Form.Item
              label="Mô tả lớp học"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please input your classroom description!',
                },
              ]}
            >
              <Input.TextArea size="large" placeholder="Enter classroom description" readOnly style={{ height: 150 }} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="user-profile-form-button"
                onClick={handleUpdateClassroom}
              >
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
          <h1>Thông tin về giảng viên: </h1>
          <Descriptions bordered column={1} size="large">
            <Descriptions.Item label="Fullname" span={1}>
              <UserOutlined /> {detailClass?.teacher?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <MailOutlined /> {detailClass?.teacher?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <PhoneOutlined /> {detailClass?.teacher?.phone}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Card>
    </>
  );
}

export default ClassDetail;
