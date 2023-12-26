import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, Input, Modal, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import SubMenu from '../../components/shared/subMenu';
import { getStudentGrade, postGradeReview } from '../../services/classroom';

function StudentViewGrade() {
  const [studentGrade, setStudentGrade] = useState();
  const [modaldata, setmodaldata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  console.log('Location: ', location);

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  useEffect(() => {
    const studentGrade = async (id) => {
      const dataRespond = await getStudentGrade(id);
      console.log('Student grade Data respond', dataRespond);
      setStudentGrade(dataRespond.data.data);
    };

    studentGrade(idClass);
  }, [idClass]);

  console.log('Student Grade: ', studentGrade);
  const showModal = (record) => {
    console.log('Record: ', record);
    setmodaldata(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log('Success:', values);
  };

  const handleSubmit = async () => {
    try {
      const data = form.getFieldValue();
      console.log('Form data: ', data);
      const dataCallAPI = {
        studentGrade: data.studentGrade,
        expectationGrade: data.expectationGrade,
        reason: data.reason,
      };
      console.log('Đơn phúc khảo: ', dataCallAPI);
      // setError(null);
      //setLoading(true)
      const dataReturn = await postGradeReview(dataCallAPI);
      //setLoading(false)
      console.log('API Response: ', dataReturn);

      const dataUser = dataReturn.data.data;
      const status = dataReturn.data.status;

      console.log('Status: ', status);
      console.log('ReviewForm Resonse: ', dataUser);

      if (status == 'success') {
        console.log('Gửi đơn phúc khảo thành công');
      }
      // form.submit();
    } catch (error) {
      console.log('Cập nhật không thành công');
      //setLoading(false)
    }
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
      render: (record) => {
        return (
          <>
            <Button onClick={() => showModal(record)}>Phúc khảo</Button>
          </>
        );
      },
    },
  ];

  let row =
    studentGrade?.grades.map((grade) => {
      return {
        scoreId: grade._id,
        scorePart: grade.structureGrade.name,
        percentScore: grade.structureGrade.scale,
        score: grade.grade,
      };
    }) ?? [];
  const data = [
    ...row,
    {
      scorePart: 'Tổng điểm',
      score: studentGrade?.total,
    },
  ];

  return (
    <>
      <SubMenu />
      <Table bordered pagination={false} columns={columns} dataSource={data} />
      <Modal title="Đơn phúc khảo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
        <Form
          form={form}
          initialValues={{ scorePart: modaldata.scorePart, score: modaldata.score, studentGrade: modaldata.scoreId }}
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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Cột điểm phúc khảo"
            name="scorePart"
            rules={[
              {
                message: 'Please input your cột điểm!',
              },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item label="Điểm hiện tại" name="score">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Điểm kì vọng"
            name="expectationGrade"
            rules={[
              {
                required: true,
                message: 'Please input your expectation grade!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lí do"
            name="reason"
            rules={[
              {
                required: true,
                message: 'Please input your reason!',
              },
            ]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default StudentViewGrade;
