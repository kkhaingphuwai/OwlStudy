import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface PermissionGateProps {
  children: ReactNode;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

const PermissionGate = ({
  children,
  permissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGateProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  if (permissions.length === 0) {
    return <>{children}</>;
  }

  if (permissions.length === 1) {
    return hasPermission(permissions[0]) ? <>{children}</> : <>{fallback}</>;
  }

  const hasAccess = requireAll
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;
