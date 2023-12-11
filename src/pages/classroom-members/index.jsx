import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, List } from 'antd';

import SubMenu from '../../components/shared/subMenu';
import NotificationContext from '../../contexts/notification/notificationContext';
import { getClassroomParticipant } from '../../services/classroom';
import { inviteClassroom } from '../../services/teacher';

import InviteModal from './components/inviteModal';

export default function ShowClassroomMembers() {
  const [classParticipants, setClassParticipants] = useState();
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [email, setEmail] = useState('');
  const { openNotification } = useContext(NotificationContext);

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

  const handleInviteByEmail = async () => {
    try {
      const { data: response } = await inviteClassroom({ email, classroom: idClass });
      console.log(response);
      openNotification({ type: 'success', title: 'Thêm thành viên', description: 'Thêm thành viên mới thành công' });
      setOpenInviteModal(false);
      if (response.data.inviteUser) {
        setClassParticipants([...classParticipants, response.data.inviteUser]);
      }
    } catch (err) {
      console.log(err);
      openNotification({ type: 'error', title: 'Thêm thành viên', description: 'Thêm thành viên mới thất bại' });
      setOpenInviteModal(false);
    }
  };

  return (
    <div>
      <SubMenu></SubMenu>
      <div>
        <Button onClick={() => setOpenInviteModal(true)}>+ Thêm thành viên mới</Button>
        <InviteModal
          open={openInviteModal}
          onCancel={() => setOpenInviteModal(false)}
          onOk={handleInviteByEmail}
          onInputValueChange={(value) => setEmail(value)}
        />
      </div>
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
