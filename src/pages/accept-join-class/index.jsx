import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Card } from 'antd';

import { inviteToClassroom } from '../../services/classroom';

function AcceptJoinClass() {
  const { classroomId } = useParams();

  const [searchParams] = useSearchParams();
  const joinCode = searchParams.get('joinCode');

  useEffect(() => {
    const fetchData = async () => {
      try {
        await inviteToClassroom(classroomId, joinCode);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [classroomId, joinCode]);

  return (
    <div>
      <Card style={{ width: '48rem', margin: 'auto' }}>
        <div
          style={{
            backgroundColor: '#f1f3f4',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '240px',
            borderRadius: '8px',
          }}
        >
          <img src="/img/logo_square_rounded.svg" alt="" />
          <h1>Classroom</h1>
          <p>Lớp học giúp các lớp học giao tiếp, tiết kiệm thời gian và luôn có tổ chức.</p>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

            height: '240px',
          }}
        >
          <p>Bạn đang tham gia lớp học với tư cách học viên.</p>
          <Button type="primary">Tham gia lớp học</Button>
          <p>Bằng việc tham gia, bạn đồng ý chia sẻ thông tin liên hệ với những người trong lớp học của mình.</p>
        </div>
      </Card>
    </div>
  );
}

export default AcceptJoinClass;
