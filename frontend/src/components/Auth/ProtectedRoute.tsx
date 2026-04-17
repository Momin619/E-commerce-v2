import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

type Role = "seller" | "customer";

interface Props
{
  allowedRoles: Role | Role[];
}

export const ProtectedRoute = ({ allowedRoles }: Props) =>
{
  const {
    auth: { user, isLoggedIn, loading },
  } = useAuth();



  if (!isLoggedIn || !user)
  {
    return <Navigate to="/login" replace />;
  }

  const roles = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  if (!roles.includes(user.role))
  {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
