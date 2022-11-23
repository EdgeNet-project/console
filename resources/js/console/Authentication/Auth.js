import React, {useState, useEffect, useContext} from 'react';
import {useFetch} from "../Fetch";

const AuthContext = React.createContext({
    user: null
});
const AuthConsumer = AuthContext.Consumer;

const defaults = {
    'url': '',
}

const Auth = ({children}) => {
    const [ token, setToken ] = useState(null);
    const [ user, setUser ] = useState(null);
    // const [ error, setError ] = useState(null);
    // const [ loading, setLoading ] = useState(false);
    const { loading, error, get, post, abort } = useFetch()

    useEffect(() => {
        setToken(
            sessionStorage.getItem('api_token', null)
        )
    }, [])

    useEffect(() => {
        // setLoading(true)

        // const abortController = new AbortController()

        if (token) {
            console.log('aa', token)
            get('/api/user', {token: token})
                .then(data => setUser(data))
                .then(() => {
                    sessionStorage.setItem('api_token', token)
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

    return (
        <AuthContext.Provider value={{
            user: user,
            login: login,
            logout: logout,
            loading: loading,
            // error: error
        }}>{children}</AuthContext.Provider>
    )
}

const useAuth = () => {
    const { user, login, logout, loading, error } = useContext(AuthContext)

    return { user, login, logout, loading, error }
}

export { Auth, AuthContext, AuthConsumer, useAuth };