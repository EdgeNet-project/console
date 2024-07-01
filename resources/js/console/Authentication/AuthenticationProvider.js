import React, {useState, useEffect, useContext} from 'react';
import axios from "axios";
import {RouterProvider} from "react-router-dom";

// import routes from "./routes";
import authenticationRoutes from "./routes/authentication";
import Registration from "./Views/Registration";

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

const AuthenticationProvider = ({children}) => {
    const [ token, setToken ] = useState(localStorage.getItem(AUTH_TOKEN));
    const [ user, setUser ] = useState(null);
    const [ requests, setRequests ] = useState([]);
    // const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ submitting, setSubmitting ] = useState(false);
    // const { error, get, post, abort, options } = useFetch()
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        const xsrf_token = getXsrfToken();
        if (!xsrf_token) {
            /* Updates and sets the CSFR cookie */
            // fetch('/sanctum/csrf-cookie')
        }

    }, [])

    useEffect(() => {


        // const abortController = new AbortController()

        if (token) {

            setLoading(true)

            axios.defaults.headers.common = {
                Authorization: "Bearer " + token,
                Accept: "application/json"
            };

            loadUser()

            //loadRequests()
            // console.log('aa', token)

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
        } else {
            setLoading(false)
        }

        return () => {
            // abort()
        }

    }, [token])

    useEffect(() => {
        if (user && user.id) {
            axios.get('/api/requests')
                .then(({data}) => {
                    setUserRequests(data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        return () => {
            setUserRequests([])
        }
    }, [user]);

    const loadUser = () => {
        axios.get('/user')
            .then(({data}) => {
                setUser(data)
            })
            .then(() => {
                localStorage.setItem(AUTH_TOKEN, token);
            })
            .catch(() => {
                axios.defaults.headers.common = {
                    Authorization: null,
                    Accept: "application/json"
                };
                setToken(null);
                localStorage.removeItem(AUTH_TOKEN);
            })
            .finally(() => {
                setLoading(false)
            })
    }



    const login = ({email, password}) => {
        setLoading(true)
        axios.post('/login', {email: email, password: password},
            {})
            .then(({data}) => {
                // console.log(data)
                setToken(data.token)
            })
            .finally(() => {
                setLoading(false)
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
        localStorage.removeItem(AUTH_TOKEN)
        setToken(null)
        setUser(null)
    }

    const isAuthenticated = () => {
        return !!token && !!user && !loading;
    }

    const hasEmailVerified = () => {
        if (!isAuthenticated()) {
            return false;
        }

        return !!user.email_verified_at;
    }

    const hasAcceptedAup = () => {
        if (!isAuthenticated()) {
            return false;
        }

        return !!user.aup_accepted_at;
    }

    const hasTeam = () => {
        if (!isAuthenticated()) {
            return false;
        }

        return user.tenants.length > 0 || user.requests.length > 0
    }

    const hasFinishedRegistration = () => {
        return hasEmailVerified() && hasAcceptedAup()
    }

    if (loading) {
        return null;
    }

    const updateRequest = (userRequest) => {
        const idx = userRequests.findIndex(i => i.id === userRequest.id);
        if (idx !== -1) {
            setUserRequests(
                userRequests.slice(0, idx)
                    .concat([userRequest])
                    .concat(userRequests.slice(idx + 1))
            );
        }
    }

    /**
     * User is not authenticated
     */
    if (!loading && !isAuthenticated()) {
        return (
            <AuthenticationContext.Provider value={{
                user: user,
                login: login,
                loading: loading,
                // error: error

                isAuthenticated: isAuthenticated
            }}>
                <RouterProvider router={authenticationRoutes} />
            </AuthenticationContext.Provider>
        )
    }

    /**
     * User is authenticated but registration is not complete
     * - email not yet verified
     * - AUP not accepted
     * - has NO Teams
     */
    if (!hasFinishedRegistration()) {
        let step = 0;

        if (hasEmailVerified()) {
            step = 1
        }

        if (hasAcceptedAup()) {
            step = 2
        }

        // if (hasFinishedRegistration()) {
        //     step = 3
        // }

        return (
            <AuthenticationContext.Provider value={{
                user: user,
                login: login,
                loading: loading,
                loadUser: loadUser,
                // error: error

                isAuthenticated: isAuthenticated
            }}>
                <Registration step={step} />
            </AuthenticationContext.Provider>
        )
    }

    // if (!user) {
    //     return "no user"
    // }



    /**
     * User is authenticated
     */
    return (
        <AuthenticationContext.Provider value={{
            user: user,
            token: token,
            login: login,
            logout: logout,
            loading: loading,
            loadUser: loadUser,

            userRequests: userRequests,
            updateRequest: updateRequest,
            // error: error

            isAuthenticated: isAuthenticated
        }}>
            {children}
        </AuthenticationContext.Provider>
    )
}

const useAuthentication = () => {
    const { user, token, login, logout, loadUser, loading, error, isAuthenticated,
        userRequests, updateRequest
    } = useContext(AuthenticationContext)

    return {
        user, token, login, logout, loadUser, loading, error,

        userRequests, updateRequest,
        isAuthenticated
    }
}

export { AuthenticationProvider, AuthenticationContext, AuthenticationConsumer, useAuthentication };