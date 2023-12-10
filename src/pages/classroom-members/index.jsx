import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, List } from 'antd';

import SubMenu from '../../components/shared/subMenu';
import { getClassroomParticipant } from '../../services/classroom';

/*const listMembers = [
  {
    name: 'Trần Khánh Hoàng',
    email: '20120290@student.hcmus.edu.vn',
  },
  {
    name: 'Trần Khánh Hoàng',
    email: '20120290@student.hcmus.edu.vn',
  },
  {
    name: 'Trần Khánh Hoàng',
    email: '20120290@student.hcmus.edu.vn',
  },
  {
    name: 'Trần Khánh Hoàng',
    email: '20120290@student.hcmus.edu.vn',
  },
  {
    name: 'Trần Khánh Hoàng',
    email: '20120290@student.hcmus.edu.vn',
  },
];*/

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
  }, []);

  console.log('Detail class: ', classParticipants);
  return (
    <div>
      <SubMenu></SubMenu>
      <List
        dataSource={classParticipants}
        renderItem={(member) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={member.name}
              description={member.email}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
