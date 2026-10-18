import React, { createContext, useState, useEffect } from 'react';

// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [ user, setUserState ] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const setUser = (userData) => {
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
        setUserState(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
