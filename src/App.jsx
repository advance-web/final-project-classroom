import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';

import Page_Layout from './components/shared/layout';
import AuthContext from './contexts/auth/auth-context';
import Home from './pages/home';
import Landing from './pages/landing';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import UserProfile from './pages/user-profile';
import { getMe } from './services/auth';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};

const AuthRoute = ({ user, children }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

AuthRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};

function App() {
  const { user, setUser } = React.useContext(AuthContext);
  useEffect(() => {
    const initUserData = async () => {
      try {
        console.log('getme');
        const response = await getMe();
        const userData = response.data.data.data;
        setUser(userData);
      } catch (err) {
        console.log('Not logged in');
      }
    };
    initUserData();
  }, [setUser]);
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<Page_Layout />}>
          <Route path="/" element={<Landing />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute user={user}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AuthRoute user={user}>
                <SignIn />
              </AuthRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthRoute user={user}>
                <SignUp />
              </AuthRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;

const GlobalStyle = createGlobalStyle`
    body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `;
