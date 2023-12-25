import { useEffect, useState } from 'react';
import { Button, Card, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';

import { getReviewDetail } from '../../services/classroom';

function ReviewComment() {
  const [reviewDetail, setReviewDetail] = useState();
  // const [comment, setComment] = useState();

  const reviewId = '6587dcdf55861303559c6512';

  useEffect(() => {
    const reviewDetail = async (id) => {
      const dataRespond = await getReviewDetail(id);
      console.log('Data respond', dataRespond);
      setReviewDetail(dataRespond.data.data);
      // setComment(dataRespond.data.data.comments);
    };

    reviewDetail(reviewId);
  }, [reviewId]);

  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSubmit = () => {
    // setComment(...prev, [{
    //     name: 'Khoa phung',
    // }]);
  };
  console.log('Review Detail: ', reviewDetail);
  return (
    <>
      <Card>
        <h1>Chi tiết phúc khảo</h1>
        <p>Họ tên: Anh Khoa</p>
        <p>Cột điểm: Giữa kì</p>
        <p>Điểm: 7</p>
        <p>Điểm mong muốn: 8</p>
        <p>Lí do: Not good enough</p>
      </Card>
      <Card>
        <h2>
          Phần bình luận:
          <Form
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
                <strong>{comment.user.name}</strong>: {comment.comment}
              </p>
            </Card>
          );
        })}
      </Card>
    </>
  );
}

export default ReviewComment;
