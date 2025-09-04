import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import authStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from './spinner/Loader';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import commonStore from '../stores/commonStore';
const ProtectedRoute = observer(({ children, adminOnly = false }) => {
  const { loading, initialized, user, isAdmin } = authStore;
  const location = useLocation();

  // Пока идёт первичная проверка — лоадер
  if (!initialized || loading) {
    return <Loader fullPage />;
  }

  // Нет пользователя — на логин
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Требуется админ, а прав нет — 404 (или "/" — как вам нужно)
  if (adminOnly && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
});

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;