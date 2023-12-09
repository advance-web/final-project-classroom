import { Button, Card, Form, Input, Typography } from 'antd';

import SubMenu from '../../components/shared/subMenu';

function ClassDetail() {
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
            Khóa học React
          </h1>
        </div>

        <div className="course-info">
          <h1>Thông tin về khóa học</h1>
          <Form
            name="normal_user-profile"
            className="user-profile-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, marginLeft: '8rem' }}
          >
            <Form.Item label="Tên phòng học" name="classroomName">
              <Input size="large" readOnly />
            </Form.Item>

            <Form.Item
              label="Tên môn học"
              name="subjectName"
              rules={[
                {
                  required: true,
                  message: 'Please input your classroom name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter classroom name" />
            </Form.Item>

            <Form.Item
              label="Tên giáo viên"
              name="Fullname"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              label="Mô tả lớp học"
              name="classroomDescription"
              rules={[
                {
                  required: true,
                  message: 'Please input your classroom description!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter classroom description" />
            </Form.Item>

            <Form.Item
              label="Số lượng học sinh"
              name="MaxStudent"
              rules={[
                {
                  required: true,
                  message: 'Please input your number of student!',
                },
              ]}
            >
              <Input size="large" placeholder="Enter number of student" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Typography.Text type="danger"></Typography.Text>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" className="user-profile-form-button">
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </>
  );
}

export default ClassDetail;
