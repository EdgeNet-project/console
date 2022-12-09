import React from 'react';
import { useAuth } from "../Auth";

const Authenticated = ({children}) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return null;
    }

    return children;
};

export default Authenticated;
