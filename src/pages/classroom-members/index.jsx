import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';

import SubMenu from '../../components/shared/subMenu';
import { getClassroomParticipant } from '../../services/classroom';

export default function ShowClassroomMembers() {
  const [classParticipants, setClassParticipants] = useState();
  const location = useLocation();
  console.log('Location: ', location);

  const idClass = location.pathname.split('/')[2];
  console.log('ID Class: ', idClass);

  useEffect(() => {
    const getClassParticipants = async (id) => {
      const dataRespond = await getClassroomParticipant(id);
      console.log('Data respond', dataRespond);
      setClassParticipants(dataRespond.data.data);
    };

    getClassParticipants(idClass);
  }, [idClass]);

  console.log('Detail class: ', classParticipants);
  const listTeachers = classParticipants?.filter((item) => item.role === 'teacher') || [];
  const listStudents = classParticipants?.filter((item) => item.role === 'student') || [];

  console.log('List teachers: ', listTeachers);
  console.log('List students: ', listStudents);

  return (
    <div>
      <SubMenu></SubMenu>
      <h2>Giáo viên</h2>
      <List
        dataSource={listTeachers}
        renderItem={(teacher) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={teacher.name}
              description={teacher.email}
            />
          </List.Item>
        )}
      />

      <h2>Học viên</h2>
      <List
        dataSource={listStudents}
        renderItem={(student) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={student.name}
              description={student.email}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
