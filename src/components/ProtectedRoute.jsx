import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const SECRET_ADMIN_KEY = 'amsed_vault_secure_987654';

/**
 * ProtectedRoute:
 * Protects admin area from public visitors and intruders.
 * Only grants access if the secret authentication key is provided in URL or stored in local session.
 * Otherwise redirects public visitors to home page with zero trace.
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
      return localStorage.getItem('amsed_admin_authorized') === SECRET_ADMIN_KEY;
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

  // If unauthorized visitor tries to access /admin, redirect immediately to home page
  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export { ProtectedRoute };
