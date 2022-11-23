import React, { useContext } from 'react';
import { AuthContext } from "../Auth";

const Authenticated = ({children}) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return null;
    }

    return children;
};

const isAuthenticated = () => {
    const { user } = useContext(AuthContext);

    return !!user
}

export { Authenticated, isAuthenticated };
