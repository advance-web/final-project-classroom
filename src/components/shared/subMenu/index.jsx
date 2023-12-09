import { Link } from 'react-router-dom';
import { Menu } from 'antd';

function SubMenu() {
  return (
    <Menu
      theme="light"
      mode="horizontal"
      defaultSelectedKeys={['1']}
      style={{
        marginBottom: '10px',
      }}
    >
      <Menu.Item key="1">
        <Link to="">Thông tin lớp học</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="">Mọi người</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="">Điểm</Link>
      </Menu.Item>
    </Menu>
  );
}

export default SubMenu;
