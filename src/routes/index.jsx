// src/routes/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import MainLayout from '../components/layout/MainLayout.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx'; // Убедись, что этот импорт есть
import HomePage from '../pages/HomePage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import PremiumPage from '../pages/PremiumPage.jsx';
import SectionPage from '../pages/SectionPage.jsx';
import LecturePage from '../pages/LecturePage.jsx';
import TestPage from '../pages/TestPage.jsx';
import AdminPage from '../pages/AdminPage.jsx';
import AdminCreateSectionPage from '../pages/AdminCreateSectionPage.jsx';
import AdminChaptersPage from '../pages/AdminChaptersPage.jsx';
import AdminLecturesPage from '../pages/AdminLecturesPage.jsx';
import AdminPromptsPage from '../pages/AdminPromptsPage.jsx';
import AdminTestPage from '../pages/AdminTestPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import LinkAccountPage from '../pages/LinkAccountPage.jsx'; // Убедись, что этот импорт есть

// ВОТ НОВЫЙ ИМПОРТ
import TelegramAuthPage from '../pages/TelegramAuthPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'premium', element: <PremiumPage /> },
        ],
      },
      { 
        path: 'section/:sectionId', 
        element: <SectionPage /> 
      },
      {
        path: 'lecture/:lectureId',
        element: <LecturePage />,
      },
      {
        path: 'test/:testId',
        element: <TestPage />,
      },
      {
        path: 'link-account',
        element: <LinkAccountPage />,
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminPage /> },
            { path: 'create-section', element: <AdminCreateSectionPage /> },
            { path: 'sections/:sectionId', element: <AdminChaptersPage /> },
            { path: 'sections/:sectionId/test', element: <AdminTestPage /> },
            { path: 'chapters/:chapterId', element: <AdminLecturesPage /> },
            { path: 'chapters/:chapterId/test', element: <AdminTestPage /> },
            { path: 'lectures/:lectureId/prompts', element: <AdminPromptsPage /> },
            { path: 'lectures/:lectureId/test', element: <AdminTestPage /> }
        ]
      }
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  // ВОТ НОВЫЙ РОУТ
  {
    path: '/auth/telegram',
    element: <TelegramAuthPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;