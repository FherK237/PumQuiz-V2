import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children}: Props) => {
  const token = localStorage.getItem('token');

  /* Si no hay token (no esta logueado) lo redirigimos al login */
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /* Si hay token, renderizamos el componente hijo (la pagina protegida) */
  return children;
};

export default ProtectedRoute;