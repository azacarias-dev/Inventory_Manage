import React from 'react';
import AuthPage from '../../features/auth/pages/AuthPage';
import DashboardPage from './DashboardPage';
import { useAuthStore } from '../../features/auth/store/authStore';

function App() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  return isLoggedIn ? (
    <DashboardPage onLogout={logout} />
  ) : (
    <AuthPage onLogin={() => {}} />
  );
}

export default App;
