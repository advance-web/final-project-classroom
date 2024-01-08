import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, Flex, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import useAuth from '../../hooks/useAuth';
import { getDetailClassroomById } from '../../services/classroom';
import { getReviewDetail, getStudentGrade, postComment, updateGradeReviewStatus } from '../../services/grade';
import { notifyAnotherUserInClassroom } from '../../services/notification';

function ReviewComment() {
  const [reviewDetail, setReviewDetail] = useState();
  const { user, isTeacher } = useAuth();
  const [studentGrade, setStudentGrade] = useState();

  const location = useLocation();
  console.log('Location: ', location);

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  const reviewId = location.pathname.split('/')[4];
  console.log('Review Id: ', reviewId);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    const reviewDetail = async (id) => {
      const dataRespond = await getReviewDetail(id);
      console.log('Data respond', dataRespond);
      setReviewDetail(dataRespond.data.data);
    };

    reviewDetail(reviewId);

    const studentGrade = async (id) => {
      const dataRespond = await getStudentGrade(id);
      console.log('Student grade Data respond', dataRespond);
      setStudentGrade(dataRespond.data.data);
    };

    studentGrade(idClass);
  }, [reviewId]);

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = async () => {
    try {
      const data = form.getFieldValue();
      console.log('Form data: ', data);
      const dataCallAPI = {
        comment: data.comment,
      };
      console.log('Comment: ', dataCallAPI);
      // setError(null);
      //setLoading(true)
      const dataReturn = await postComment(reviewId, dataCallAPI);
      //setLoading(false)
      console.log('API Comment Response: ', dataReturn);

      const dataUser = dataReturn.data.data;
      const status = dataReturn.data.status;

      console.log('Status: ', status);
      console.log('Comment Response: ', dataUser);

      if (status === 'success') {
        console.log('Gửi comment thành công');

        // Update the reviewDetail state with the new comment
        setReviewDetail((prevReviewDetail) => ({
          ...prevReviewDetail,
          comments: [
            ...prevReviewDetail.comments,
            {
              ...dataUser,
              user: {
                name: user.name,
              },
            },
          ],
        }));
        form.resetFields();

        // Call API to get detail classroom to take the teacher ID
        const dataClassDetailResponse = await getDetailClassroomById(idClass);
        console.log('dataClassDetail Response: ', dataClassDetailResponse);
        const dataClassroomDetail = dataClassDetailResponse.data.data;
        const status = dataClassDetailResponse.data.status;

        console.log('Status: ', status);
        console.log('Classroom Detail Response: ', dataClassroomDetail);

        // Call API to post Notify another user in classroom
        let to;
        if (reviewDetail.student == dataUser.user) {
          to = dataClassroomDetail.teacher._id;
        } else {
          to = dataUser.user;
        }
        const data = {
          to: to,
          type: 'REPLY_GRADE_REVIEW',
          redirect: `/classroom/${idClass}/grade-review/${reviewId}`,
        };
        const dataNotify = await notifyAnotherUserInClassroom(idClass, data);
        console.log('dataNotify Response: ', dataNotify);
      }
      // form.submit();
    } catch (error) {
      console.log('Cập nhật không thành công');
      //setLoading(false)
    }
  };
  console.log('Review Detail: ', reviewDetail);

  const handleAccepted = async () => {
    const formValue = form1.getFieldValue();
    console.log('Form data: ', formValue);
    const data = {
      status: 'ACCEPTED',
      finalGrade: formValue.finalGrade,
    };
    const response = await updateGradeReviewStatus(reviewId, data);
    console.log('Response: ', response);
    if (response?.data?.status === 'success') {
      setReviewDetail((prev) => {
        return {
          ...prev,
          status: 'ACCEPTED',
          finalGrade: response?.data?.data?.finalGrade,
        };
      });
      // Call API to get detail classroom to take the teacher ID
      const dataClassDetailResponse = await getDetailClassroomById(idClass);
      console.log('dataClassDetail Response: ', dataClassDetailResponse);
      const dataClassroomDetail = dataClassDetailResponse.data.data;
      const status = dataClassDetailResponse.data.status;

      console.log('Status: ', status);
      console.log('Classroom Detail Response: ', dataClassroomDetail);

      // Call API to post Notify another user in classroom
      const data = {
        to: reviewDetail?.student,
        type: 'DECIDED_GRADE_REVIEW',
        redirect: `/classroom/${idClass}/grade-review/${reviewId}`,
      };
      const dataNotify = await notifyAnotherUserInClassroom(idClass, data);
      console.log('dataNotify Response: ', dataNotify);
    }
  };

  const handleDenied = async () => {
    const data = {
      status: 'DENIED',
    };
    const response = await updateGradeReviewStatus(reviewId, data);
    console.log('Response: ', response);
    if (response?.data?.status === 'success') {
      setReviewDetail((prev) => {
        return {
          ...prev,
          status: 'DENIED',
        };
      });
      // Call API to get detail classroom to take the teacher ID
      const dataClassDetailResponse = await getDetailClassroomById(idClass);
      console.log('dataClassDetail Response: ', dataClassDetailResponse);
      const dataClassroomDetail = dataClassDetailResponse.data.data;
      const status = dataClassDetailResponse.data.status;

      console.log('Status: ', status);
      console.log('Classroom Detail Response: ', dataClassroomDetail);

      // Call API to post Notify another user in classroom
      const data = {
        to: reviewDetail?.student,
        type: 'DECIDED_GRADE_REVIEW',
        redirect: `/classroom/${idClass}/grade-review/${reviewId}`,
      };
      const dataNotify = await notifyAnotherUserInClassroom(idClass, data);
      console.log('dataNotify Response: ', dataNotify);
    }
  };

  let statusMessages;
  switch (reviewDetail?.status) {
    case 'INREVIEW':
      statusMessages = isTeacher ? (
        <Flex wrap="wrap" gap="small">
          <Form
            name="form1"
            form={form1}
            key={form1}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item
              name="finalGrade"
              label="Final grade"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Button type="primary" onClick={() => handleAccepted()}>
            Chấp thuận
          </Button>
          <Button type="primary" danger onClick={() => handleDenied()}>
            Từ chối
          </Button>
        </Flex>
      ) : (
        <p>
          <strong>Tình trạng</strong>: Đang được xem xét
        </p>
      );
      break;
    case 'ACCEPTED':
      statusMessages = (
        <p>
          <strong>Tình trạng</strong>: Đã được chấp nhận
        </p>
      );
      break;
    case 'DENIED':
      statusMessages = (
        <p>
          <strong>Tình trạng</strong>: Đã bị từ chối
        </p>
      );
      break;
    default:
      break;
  }

  return (
    <>
      <Card>
        <h1>Chi tiết phúc khảo</h1>
        <p>Họ tên: {user?.name}</p>
        {studentGrade?.grades.map((grade) => {
          if (grade.id === reviewDetail?.studentGrade) {
            return (
              <>
                <p>Cột điểm: {grade.structureGrade.name}</p>
                <p>Điểm: {grade.grade}</p>
              </>
            );
          }
        })}
        <p>Điểm mong muốn: {reviewDetail?.expectationGrade}</p>
        <p>Lí do: {reviewDetail?.reason}</p>
        <p>Điểm cuối cùng: {reviewDetail?.finalGrade}</p>
        {statusMessages}
      </Card>
      <Card>
        <h2>
          Phần bình luận:
          <Form
            form={form}
            key={form}
            name="basic"
            style={{
              minWidth: '800px',
              display: 'flex',
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Your Comment"
              name="comment"
              rules={[
                {
                  required: true,
                  message: 'Please input your comment!',
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
                Đăng
              </Button>
            </Form.Item>
          </Form>
        </h2>
        {reviewDetail?.comments.map((comment, index) => {
          return (
            <Card key={index}>
              <p>
                <strong>{comment?.user?.name}</strong>: {comment?.comment}
              </p>
            </Card>
          );
        })}
      </Card>
    </>
  );
}

export default ReviewComment;
