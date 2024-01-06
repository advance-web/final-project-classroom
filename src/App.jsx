import React, { useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';

import Page_Layout from './components/shared/layout';
import AuthContext from './contexts/auth/auth-context';
import NotificationContext from './contexts/notification/notificationContext';
import NotificationPopupProvider from './contexts/notification-popup/notification-popup-provider';
import useAuth from './hooks/useAuth';
import { getRedirect } from './libs/utils/localStorage';
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
import Notifications from './pages/notifications';
import ResetPassword from './pages/reset-password';
import ReviewComment from './pages/review-comment';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import MappingStudentID from './pages/student-mapping-id';
import StudentViewGrade from './pages/student-view-grade';
import SuccessPage from './pages/successPage';
import UserProfile from './pages/user-profile';
import { getMe } from './services/auth';

const ProtectedRoute = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const location = useLocation();
  if (!user && userLoaded) {
    return <Navigate to="/sign-in" replace state={{ redirect: location }} />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node,
};

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    const redirect = getRedirect();
    console.log(redirect);
    return <Navigate to={redirect ? redirect : '/'} replace />;
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
  const { setUser, setLoaded } = React.useContext(AuthContext);
  useEffect(() => {
    const initUserData = async () => {
      try {
        const response = await getMe();
        const userData = response.data.data;
        setUser(userData);
        setLoaded(true);
      } catch (err) {
        setLoaded(true);
        console.log('Not logged in');
      }
    };
    initUserData();
  }, [setUser, setLoaded]);
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<Page_Layout />}>
          <Route path="/" element={<Landing />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AuthRoute>
                <SignIn />
              </AuthRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthRoute>
                <SignUp />
              </AuthRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accept-send-email"
            element={
              <ProtectedRoute>
                <AcceptToSentEmailResetPassword />
              </ProtectedRoute>
            }
          />

          <Route path="/login-success/:token" element={<LoginSuccess />} />
          <Route
            path="/classroom/:id"
            element={
              <ProtectedRoute>
                <ClassDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:id/participants"
            element={
              <ProtectedRoute>
                <ShowClassroomMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/invite/:classroomId"
            element={
              <ProtectedRoute>
                <AcceptJoinClass />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:id"
            element={
              <ProtectedRoute>
                <ClassDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:id/participants"
            element={
              <ProtectedRoute>
                <ShowClassroomMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:id/grade-structure"
            element={
              <ProtectedRoute>
                <RestrictedRoute role="teacher">
                  <GradeStructure />
                </RestrictedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:id/grade-board"
            element={
              <ProtectedRoute>
                <RestrictedRoute role="teacher">
                  <GradeBoard />
                </RestrictedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom/:id/grade-review"
            element={
              <ProtectedRoute>
                <GradeReview />
              </ProtectedRoute>
            }
          />
          <Route path="/classroom/invite/:classroomId" element={<AcceptJoinClass />} />

          <Route
            path="/classroom/:id/studentGrade"
            element={
              <ProtectedRoute>
                <RestrictedRoute role="student">
                  <StudentViewGrade />
                </RestrictedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-mapping-id"
            element={
              <ProtectedRoute>
                <RestrictedRoute role="student">
                  <MappingStudentID />
                </RestrictedRoute>
              </ProtectedRoute>
            }
          />
          <Route path="/classroom/:id/grade-review/:reviewId" element={<ReviewComment />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/create-classroom"
            element={
              <ProtectedRoute>
                <RestrictedRoute role="teacher">
                  <CreateClassroom>
                    <NotificationPopupProvider></NotificationPopupProvider>
                  </CreateClassroom>
                </RestrictedRoute>
              </ProtectedRoute>
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
