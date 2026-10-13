import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const SECRET_ADMIN_KEY = 'amsed_vault_secure_987654';

/**
 * ProtectedRoute:
 * Protects admin area from public visitors and intruders.
 * Only grants access if the secret authentication key is provided in URL or stored in local session.
 * Otherwise redirects public visitors to login page or home page.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyParam = searchParams.get('key') || searchParams.get('token') || searchParams.get('secret');

  const [authorized, setAuthorized] = useState(() => {
    if (keyParam === SECRET_ADMIN_KEY) {
      try {
        localStorage.setItem('amsed_admin_authorized', SECRET_ADMIN_KEY);
      } catch (e) {}
      return true;
    }
    try {
      return localStorage.getItem('amsed_admin_authorized') === SECRET_ADMIN_KEY || localStorage.getItem('amsed_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (keyParam === SECRET_ADMIN_KEY) {
      try {
        localStorage.setItem('amsed_admin_authorized', SECRET_ADMIN_KEY);
      } catch (e) {}
      setAuthorized(true);
    }
  }, [keyParam]);

  // If unauthorized visitor tries to access secure area, redirect to secure login
  if (!authorized) {
    if (location.pathname.startsWith('/am-ctrl-9k2l8x-2026-secure-panel-77')) {
      return <Navigate to="/am-ctrl-9k2l8x-2026-secure-panel-77/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export { ProtectedRoute };
