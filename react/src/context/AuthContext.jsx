import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = ({ token: t, userDetails }) => {
        localStorage.setItem('authToken', t);
        localStorage.setItem('user', JSON.stringify(userDetails));
        // Keep legacy keys for components that still use them directly
        localStorage.setItem('userId', userDetails.id || userDetails._id);
        localStorage.setItem('email', userDetails.email);
        localStorage.setItem('username', `${userDetails.firstName} ${userDetails.lastName}`);
        localStorage.setItem('phone', userDetails.phone || '');
        localStorage.setItem('calories', userDetails.calories || '0');
        setToken(t);
        setUser(userDetails);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
};

export default AuthContext;
