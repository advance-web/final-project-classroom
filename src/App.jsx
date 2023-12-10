import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';

import Page_Layout from './components/shared/layout';
import AuthContext from './contexts/auth/auth-context';
import NotificationPopupProvider from './contexts/notification-popup/notification-popup-provider';
import AcceptToSentEmailResetPassword from './pages/accept-send-email';
import AllClassroomOfUser from './pages/all-classrooms-of-user';
import ClassDetail from './pages/class-detail';
import ShowClassroomMembers from './pages/classroom-members';
import CreateClassroom from './pages/create-classroom';
import Home from './pages/home';
import Landing from './pages/landing';
import LoginSuccess from './pages/notification/login-success';
import ResetPassword from './pages/reset-password';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import SuccessPage from './pages/successPage';
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
        const response = await getMe();
        const userData = response.data.data;
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
          {/* <Route
            path="/class-detail"
            element={
              <ProtectedRoute user={user}>
                <ClassDetail />
              </ProtectedRoute>
            }
          /> */}
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
          <Route
            path="/reset-password"
            element={
              <AuthRoute user={user}>
                <ResetPassword />
              </AuthRoute>
            }
          />
          <Route
            path="/accept-send-email"
            element={
              <AuthRoute user={user}>
                <AcceptToSentEmailResetPassword />
              </AuthRoute>
            }
          />

          <Route path="/login-success/:token" element={<LoginSuccess />} />
          <Route path="/class-detail/:id" element={<ClassDetail />} />
          <Route path="/class-members/:id" element={<ShowClassroomMembers />} />
          <Route
            path="/create-classroom"
            element={
              <CreateClassroom>
                <NotificationPopupProvider></NotificationPopupProvider>
              </CreateClassroom>
            }
          />
          <Route path="/all-classrooms" element={<AllClassroomOfUser />} />
        </Route>
        <Route path="/verify" element={<SuccessPage />} />
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
