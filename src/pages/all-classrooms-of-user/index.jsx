import { useEffect, useState } from 'react';
import { Col, Row } from 'antd';

import CardClassroomInfo from '../../components/shared/card-classroom-info';
import { getMyClassroom } from '../../services/classroom';

/*
const listClassrooms = [
  {
    classroomID: 'CL123',
    classroomName: 'Toán cao cấp 20CTT3',
    subject: 'Toán cao cấp',
    teacher: 'Nguyen Van B',
    description: 'Lớp này rất hay bạn có thể tham gia ngay và luôn',
  },
  {
    classroomID: 'CL124',
    classroomName: 'Toán cao cấp 20CTT4',
    subject: 'Toán cao cấp',
    teacher: 'Nguyen Van B',
    description: 'Lớp này rất hay bạn có thể tham gia ngay và luôn',
  },
  {
    classroomID: 'CL125',
    classroomName: 'Toán cao cấp 20CTT3',
    subject: 'Toán cao cấp',
    teacher: 'Nguyen Van B',
    description: 'Lớp này rất hay bạn có thể tham gia ngay và luôn',
  },
];
*/
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
            <CardClassroomInfo data={classroom.classroom} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
