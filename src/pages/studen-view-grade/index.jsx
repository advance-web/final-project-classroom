import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Button, Form, Input, Modal, Table } from 'antd';

import SubMenu from '../../components/shared/subMenu';
import { getStudentGrade } from '../../services/classroom';

function StudentViewGrade() {
  const [studenGrade, setStudenGrade] = useState();
  const location = useLocation();
  console.log('Location: ', location);

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  useEffect(() => {
    const studentGrade = async (id) => {
      const dataRespond = await getStudentGrade(id);
      console.log('Data respond', dataRespond);
      setStudenGrade(dataRespond.data.data);
    };

    studentGrade(idClass);
  }, [idClass]);

  console.log('Student Grade: ', studenGrade);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const columns = [
    {
      title: 'Thành phần điểm',
      key: 'scorePart',
      dataIndex: 'scorePart',
    },
    {
      title: '% điểm',
      key: 'percentScore',
      dataIndex: 'percentScore',
    },
    {
      title: 'Số điểm',
      key: 'score',
      dataIndex: 'score',
    },
    {
      title: '',
      dataIndex: '',
      key: 'x',
      render: () => {
        return (
          <>
            <Button onClick={showModal}>Phúc khảo</Button>
          </>
        );
      },
    },
  ];

  const data = [
    {
      key: '1',
      scorePart: 'Bài tập cá nhân',
      percentScore: 30,
      score: 50,
    },
    {
      key: '2',
      scorePart: 'Giữa kì',
      percentScore: 30,
      score: 75,
    },
    {
      key: '3',
      scorePart: 'Cuối kì',
      percentScore: 40,
      score: 85,
    },
    {
      key: '4',
      scorePart: 'Tổng điểm',
      score: 85,
    },
  ];

  return (
    <>
      <SubMenu />
      <Table bordered pagination={false} columns={columns} dataSource={data} />
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* <Form.Item
            label="Họ tên"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="MSSV"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item
            label="Cột điểm phúc khảo"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Điểm hiện tại"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Điểm kì vọng"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lí do"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StudentViewGrade;
