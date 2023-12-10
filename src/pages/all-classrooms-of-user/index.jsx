import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'antd';

import CardClassroomInfo from '../../components/shared/card-classroom-info';
import { getMyClassroom } from '../../services/classroom';

export default function AllClassroomsOfUser() {
  const [listClassrooms, setListClassrooms] = useState([]);

  useEffect(() => {
    const getListClassroom = async () => {
      const dataRespond = await getMyClassroom();
      setListClassrooms(dataRespond.data.data);
    };
    getListClassroom();
  }, []);

  console.log(listClassrooms);

  return (
    <div>
      <Row gutter={[32, 32]} justify="center">
        {listClassrooms?.map((classroom) => (
          <Col style={{ marginTop: 16 }} key={classroom.classroom._id}>
            <Link to={`/class-detail/${classroom.classroom._id}`}>
              <CardClassroomInfo data={classroom.classroom} />
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
