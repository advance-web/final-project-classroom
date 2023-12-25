import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';

import Page_Layout from './components/shared/layout';
import AuthContext from './contexts/auth/auth-context';
import NotificationContext from './contexts/notification/notificationContext';
import NotificationPopupProvider from './contexts/notification-popup/notification-popup-provider';
import useAuth from './hooks/useAuth';
import AcceptJoinClass from './pages/accept-join-class';
import AcceptToSentEmailResetPassword from './pages/accept-send-email';
import ClassDetail from './pages/class-detail';
import ShowClassroomMembers from './pages/classroom-members';
import CreateClassroom from './pages/create-classroom';
import GradeBoard from './pages/grade-board';
import GradeReview from './pages/grade-review';
import GradeStructure from './pages/grade-structure';
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

const RestrictedRoute = ({ role, children }) => {
  const { user } = useAuth();
  const { openNotification } = useContext(NotificationContext);
  if (!user || user.role !== role) {
    openNotification({
      title: 'Không có quyền truy cập',
      type: 'error',
      description: 'Hãy đăng nhập với quyền phù hợp để truy cập chức năng',
    });
    return <Navigate to="/" replace />;
  }
  return children;
};

RestrictedRoute.propTypes = {
  role: PropTypes.string,
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
          <Route path="/classroom/:id" element={<ClassDetail />} />
          <Route path="/classroom/:id/participants" element={<ShowClassroomMembers />} />
          <Route path="/classroom/:id/grade-structure" element={<GradeStructure />} />
          <Route path="/classroom/:id/grade-board" element={<GradeBoard />} />
          <Route path="/classroom/:id/grade-review" element={<GradeReview />} />
          <Route path="/classroom/invite/:classroomId" element={<AcceptJoinClass />} />
          <Route
            path="/create-classroom"
            element={
              <CreateClassroom>
                <NotificationPopupProvider></NotificationPopupProvider>
              </CreateClassroom>
            }
          />
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
