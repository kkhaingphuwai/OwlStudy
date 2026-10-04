import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../../service/authService";
import { notifyAuthUpdated } from "../../service/authEvent";

export interface AuthContextType {
    user: any | null;
    permissions: string[];
    roles: string[];
    login: (email: string, password: string) => Promise<void>;
    isAuthenticated: boolean;
    hasPermission: (requiredPermissions: string) => boolean;
    hasAnyPermission: (requiredPermissions: string[]) => boolean;
    hasAllPermissions: (requiredPermissions: string[]) => boolean;
    logout: () => void;
    setAuth: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [roles, setRoles] = useState([]);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        try {
            const userRaw = sessionStorage.getItem("user");
            const permissionsRaw = sessionStorage.getItem("permissions");
            const rolesRaw = sessionStorage.getItem("roles");

            if (userRaw && userRaw !== "undefined") {
                setUser(JSON.parse(userRaw));
            }

            if (permissionsRaw && permissionsRaw !== "undefined") {
                setPermissions(JSON.parse(permissionsRaw));
            }

            if (rolesRaw && rolesRaw !== "undefined") {
                setRoles(JSON.parse(rolesRaw));
            }
        } catch (e) {
            sessionStorage.clear();
        } finally {
            setAuthReady(true);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authService.login(email, password);
        setUser(data.userInfo);
        setPermissions(data.permissions);
        setRoles(data.roles);

        sessionStorage.setItem("user", JSON.stringify(data.userInfo));
        sessionStorage.setItem("permissions", JSON.stringify(data.permissions));
        sessionStorage.setItem("roles", JSON.stringify(data.roles));
        
        sessionStorage.setItem("accessToken",data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        notifyAuthUpdated(data);
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    const hasAnyPermission = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.some((perm) => permissions.includes(perm));
    };

    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        return requiredPermissions.every((perm: string) =>
            permissions.includes(perm),
        );
    };

    const setAuth = (data: any) => {
        setUser(data.userInfo);
        setPermissions(data.permissions || []);
        setRoles(data.roles || []);
    };

    const logout = () => {
        setUser(null);
        setPermissions([]);
        setRoles([]);
        sessionStorage.clear();
    };

    const value: AuthContextType = {
        user,
        permissions,
        roles,
        login,
        isAuthenticated: !!user,
        hasAnyPermission,
        hasAllPermissions,
        hasPermission,
        logout,
        setAuth,
    };

    if (!authReady) {
        return null; // or loading spinner
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
