import { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/auth.service";
import { AUTH_CONFIG } from "../config";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    localStorage.removeItem(AUTH_CONFIG.tokenKey);
                    localStorage.removeItem(AUTH_CONFIG.userKey);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        const response = await authService.login(credentials);
        const { token, user: userData } = response.data;

        localStorage.setItem(AUTH_CONFIG.tokenKey, token);
        localStorage.setItem(AUTH_CONFIG.userKey, JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        return userData;
    }, []);

    const register = useCallback(async (userData) => {
        const response = await authService.register(userData);
        return response;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
            localStorage.removeItem(AUTH_CONFIG.userKey);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
