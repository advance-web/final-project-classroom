import { useContext } from 'react';
import { BiPlanet } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { Button, Layout, Menu } from 'antd';

import AuthContext from '../../../contexts/auth/auth-context';
import { logOut } from '../../../services/auth';

const { Header } = Layout;

const HeaderLogin = () => {
  const { user, setUser } = useContext(AuthContext);

  return (
    <Layout
      style={{
        marginBottom: '10px',
      }}
      className="layout"
    >
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0px',
          boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
        }}
      >
        <div className="demo-logo" />

        {/* Left-aligned menu items */}
        <Menu
          className="menu"
          theme="light"
          mode="horizontal"
          // defaultSelectedKeys={['1']}
          style={{
            flex: 'auto',
            minWidth: 0,
          }}
        >
          <Menu.Item key="1">
            <Link to="/home">
              <p style={{ marginRight: '8px', lineHeight: '0px' }}>
                {' '}
                {/* Adjust margin as needed */}
                <BiPlanet size={35} />
              </p>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/user-profile">Thông tin cá nhân</Link>
          </Menu.Item>
        </Menu>

        <Menu
          theme="light"
          mode="horizontal"
          // defaultSelectedKeys={['1']}
          style={{
            flex: 'auto',
            minWidth: 0,
            justifyContent: 'flex-end',
          }}
        >
          <Menu.Item
            key="3"
            style={{
              cursor: 'initial', // Set the cursor to 'initial' to remove the pointer
            }}
            onClick={(e) => e.preventDefault()}
          >
            <span>Xin chào {user.name}</span>
          </Menu.Item>
          <Menu.Item key="4" onClick={(e) => e.preventDefault()}>
            <Button
              onClick={() => {
                logOut();
                localStorage.removeItem('jwt');
                setUser(null);
              }}
            >
              <a href="/">Đăng xuất</a>
            </Button>
          </Menu.Item>
        </Menu>
      </Header>
    </Layout>
  );
};

export default HeaderLogin;
