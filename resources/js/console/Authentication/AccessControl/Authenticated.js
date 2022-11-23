import React from 'react';
import { useAuth } from "../Auth";

const Authenticated = ({children}) => {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    return children;
};

const isAuthenticated = () => {
    const { user } = useAuth();

    return !!user
}

export { Authenticated, isAuthenticated };
