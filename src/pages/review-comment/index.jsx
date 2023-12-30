import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import AuthContext from '../../contexts/auth/auth-context';
import { getDetailClassroomById, getReviewDetail, getStudentGrade, postComment } from '../../services/classroom';
import { notifyAnotherUserInClassroom } from '../../services/notification';

function ReviewComment() {
  const [reviewDetail, setReviewDetail] = useState();
  const { user } = useContext(AuthContext);
  const [studentGrade, setStudentGrade] = useState();

  const location = useLocation();
  console.log('Location: ', location);

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  const reviewId = location.pathname.split('/')[4];
  console.log('Review Id: ', reviewId);

  const [form] = Form.useForm();

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
          redirect: `/classroom/${idClass}/gradeReview/${dataUser.id}`,
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
          } else {
            return (
              <>
                <p>Cột điểm: </p>
                <p>Điểm: </p>
              </>
            );
          }
        })}
        <p>Điểm mong muốn: {reviewDetail?.expectationGrade}</p>
        <p>Lí do: {reviewDetail?.reason}</p>
      </Card>
      <Card>
        <h2>
          Phần bình luận:
          <Form
            form={form}
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
