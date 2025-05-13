import LoginForm from "./components/forms/login-form/LoginForm"
import Registration from './pages/RegistrationPage';
import TeamsPage from './pages/teams-page/TeamsPage';
import StudentProfilePage from "./pages/student-profile-page/StudentProfile";
import AdminPage from './pages/AdminPage';
import TeamProfilePage from './pages/team-profile-page/TeamProfilePage';
import StudentsPage from './pages/students-page/StudentsPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from "./pages/admin-panel/AdminDashboard";

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
    element: <AdminDashboard />
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
