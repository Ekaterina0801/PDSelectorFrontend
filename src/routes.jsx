import LoginForm from "./components/login-form/LoginForm"
import Registration from './pages/RegistrationPage';
import TeamsPage from './pages/TeamsPage';
import StudentProfilePage from "./pages/StudentProfile";
import AdminPage from './pages/AdminPage';
import TeamProfilePage from './pages/TeamProfilePage';
import StudentsPage from './pages/StudentsPage';
import AuthPage from './pages/AuthPage';

const routes = [
  {
    path: '/login',
    element: <LoginForm />
  },
  {
    path: '/registration',
    element: <Registration />
  },
  {
    path: '/teams',
    element: <TeamsPage />
  },
  {
    path: '/profile',
    element: <StudentProfilePage />
  },
  {
    path: '/admin',
    element: <AdminPage />
  },
  {
    path: '/teams/:teamId',
    element: <TeamProfilePage />
  },
  {
    path: '/students/:studentId',
    element: <StudentProfilePage />
  },
  {
    path: '/students',
    element: <StudentsPage />
  },
  {
    path: '/auth',
    element: <AuthPage />
  },
];

export default routes;
