import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Empty, Row, Typography } from 'antd';

import CardClassroomInfo from '../../components/shared/card-classroom-info';
import { getMyClassroom } from '../../services/classroom';

const { Title } = Typography;

export default function Home() {
  const [listClassrooms, setListClassrooms] = useState([]);

  useEffect(() => {
    const getListClassroom = async () => {
      const dataRespond = await getMyClassroom();
      setListClassrooms(dataRespond.data.data);
    };
    getListClassroom();
  }, []);

  console.log(listClassrooms);
  console.log('Length array: ', listClassrooms.length);

  return (
    <div>
      {listClassrooms.length > 0 ? (
        <div>
          <Title level={2}>Lớp học của tôi</Title>
          <Row gutter={[32, 32]} justify="center">
            {listClassrooms.map((classroom) => (
              <Col style={{ marginTop: 16 }} key={classroom?.classroom?.id}>
                <Link to={`/classroom/${classroom?.classroom?.id}`}>
                  <CardClassroomInfo data={classroom?.classroom} />
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Empty description={<Title level={3}>Bạn hiện đang không tham gia lớp học nào</Title>} />
        </div>
      )}
    </div>
  );
}
