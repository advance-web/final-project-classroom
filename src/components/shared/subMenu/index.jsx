import { Link, useLocation, useParams } from 'react-router-dom';
import { Menu } from 'antd';

function SubMenu() {
  const { id } = useParams();
  const location = useLocation();

  const { pathname } = location;

  const selectedKey = pathname.includes('participants') ? '2' : pathname.includes('grade-structure') ? '3' : '1';

  return (
    <Menu
      theme="light"
      mode="horizontal"
      defaultSelectedKeys={['1']}
      selectedKeys={[selectedKey]}
      style={{
        marginBottom: '10px',
      }}
    >
      <Menu.Item key="1">
        <Link to={`/classroom/${id}`}>Thông tin lớp học</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={`/classroom/${id}/participants`}>Mọi người</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to={`/classroom/${id}/grade-structure`}>Cấu trúc điểm</Link>
      </Menu.Item>
    </Menu>
  );
}

export default SubMenu;
