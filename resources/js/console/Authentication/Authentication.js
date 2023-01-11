import React, {useState, useEffect, useContext} from 'react';
import {RouterProvider} from "react-router-dom";

import {useFetch} from "../Fetch";
import router from "./Router";

const AuthenticationContext = React.createContext({
    user: null
});
const AuthenticationConsumer = AuthenticationContext.Consumer;

const AUTH_TOKEN = 'authentication_token';

const defaults = {
    'url': '',
}

const getXsrfToken = () => {
    return document.cookie.split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
}

const Authentication = ({children}) => {
    const [ token, setToken ] = useState(sessionStorage.getItem(AUTH_TOKEN));
    const [ user, setUser ] = useState(null);
    // const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ submitting, setSubmitting ] = useState(false);
    const { error, get, post, abort, options } = useFetch()

    useEffect(() => {
        const xsrf_token = getXsrfToken();
        if (!xsrf_token) {
            /* Updates and sets the CSFR cookie */
            fetch('/sanctum/csrf-cookie')
        }

    }, [])

    useEffect(() => {
        // setLoading(true)

        // const abortController = new AbortController()

        if (token) {
            options.token = token;

            // console.log('aa', token)
            get('/api/user')
                .then(data => setUser(data))
                .then(() => {
                    sessionStorage.setItem(AUTH_TOKEN, token)
                })
                .catch(() => {

                })
                .finally(() => {
                    setLoading(false)
                })
            // fetch('/api/user', {
            //     headers: {Authorization: `Bearer ${token}`},
            //     method: 'GET',
            //     // mode: 'cors',
            //     signal: abortController.signal,
            // })
            //     .then(res => res.json())
            //     .then(res => setUser(res))
            //     .catch((error) => {
            //         // setToken(null)
            //         console.log(error.message)
            //     })
            //     .finally(() => {
            //         setLoading(false)
            //     });
        }

        return () => {
            abort()
        }

    }, [token])

    const login = ({email, password}) => {

        post('/api/login', {email: email, password: password},
            {})
            .then((data) => setToken(data.token))
            .finally(() => {

            });
        // const abortController = new AbortController()
        //
        // fetch('/api/login', {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify({email: email, password: password}),
        //     signal: abortController.signal,
        // })
        //     .then(res => res.json())
        //     .then(res => setToken(res))
        //     .catch((error) => {
        //         // setToken(null)
        //         console.log(error.message)
        //     });
        //
        // return () => {
        //     abortController.abort()
        // }
    }

    const logout = () => {
        sessionStorage.setItem('api_token', null)
        setToken(null)
        // setUser(null)
    }

    const isAuthenticated = () => {
        return !!token && !!user && !loading;
    }

    console.log(token, user, loading)

    // if (!!token && !user && !loading) {
    //     /*
    //      *
    //      */
    //     return 'wait'
    // }
    //
    // if (loading) {
    //     return 'loading'
    // }

    return (
        <AuthenticationContext.Provider value={{
            user: user,
            login: login,
            logout: logout,
            loading: loading,
            // error: error

            isAuthenticated: isAuthenticated
        }}>
            {isAuthenticated() ? children : <RouterProvider router={router} />}
        </AuthenticationContext.Provider>
    )
}

const useAuthentication = () => {
    const { user, login, logout, loading, error, isAuthenticated } = useContext(AuthenticationContext)

    return {
        user, login, logout, loading, error,

        isAuthenticated
    }
}

export { Authentication, AuthenticationContext, AuthenticationConsumer, useAuthentication };