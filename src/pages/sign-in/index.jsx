import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FacebookOutlined, GoogleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';

import SubmitButton from '../../components/ui/SubmitButton';
import AuthContext from '../../contexts/auth/auth-context';
import { setJwt } from '../../libs/utils/localStorage';
import { signIn } from '../../services/auth';

import '../../css/signinStyle.css';

export default function SignIn() {
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  /*
  useEffect(() => {
    // Initialize Google API
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
      });
    });
  }, []);*/

  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const handleGoogleSignIn = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();

    auth2.signIn().then(async (googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;
      // Send the id_token to your server for verification and authentication
      console.log('Google Sign-In ID Token:', id_token);

      // Here, you can trigger the necessary actions to authenticate the user on your server
      // For example, send the id_token to your backend and handle user creation or authentication
      // ...

      // After successful authentication, you can redirect the user or update your UI
    });
  };

  const handleFacebookSignIn = async () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          // Send the accessToken to your server for verification and authentication
          console.log('Facebook Sign-In Access Token:', accessToken);

          // Here, you can trigger the necessary actions to authenticate the user on your server
          // For example, send the accessToken to your backend and handle user creation or authentication
          // ...

          // After successful authentication, you can redirect the user or update your UI
        } else {
          console.log('Facebook Sign-In failed.');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  const handleSignIn = async () => {
    try {
      const data = form.getFieldValue();
      const dataCallAPI = {
        email: data.email,
        password: data.password,
      };
      console.log('AloAlo123: ', dataCallAPI);
      setLoading(true);
      const dataReturn = await signIn(dataCallAPI);
      setLoading(false);
      const dataUser = dataReturn.data;

      const status = dataUser.status;
      const token = dataUser.token;
      const userSignin = {
        id: dataUser.data.user.id,
        email: dataUser.data.user.email,
        name: dataUser.data.user.name,
        phone: dataUser.data.user.phone,
        address: dataUser.data.user.address,
      };

      console.log('API Response: ', dataUser);
      console.log('Status: ', status);
      console.log('Token: ', token);
      console.log('Data user: ', userSignin);

      if (dataUser.status == 'success') {
        setUser(userSignin);
        setJwt(token);
        navigate('/home');
      }

      form.submit();
    } catch (error) {
      setError('Sai tài khoản hoặc mật khẩu');
      setLoading(false);
    }
  };

  const [form] = Form.useForm();

  return (
    <div className="signin">
      <div className="title-signin">Đăng nhập</div>
      <Form
        form={form}
        name="normal_signin"
        className="signin-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input size="large" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {error && (
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Typography.Text type="danger" style={{ fontSize: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {error}
            </Typography.Text>
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <SubmitButton
            form={form}
            type="primary"
            htmlType="submit"
            className="signin-form-button"
            onClick={handleSignIn}
            loading={loading}
          >
            Đăng nhập
          </SubmitButton>
          Or{' '}
          <Link to="/sign-up" style={{ fontSize: '16px' }}>
            register now!
          </Link>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          {/* Add the Google Sign-In button */}
          <Button
            icon={<GoogleOutlined />}
            onClick={handleGoogleSignIn}
            style={{ background: '#dd4b39', color: 'white' }}
          >
            Sign in with Google
          </Button>

          <Button
            icon={<FacebookOutlined />}
            onClick={handleFacebookSignIn}
            style={{ background: '#3b5998', color: 'white' }}
          >
            Sign in with Facebook
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
