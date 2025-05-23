import { useState } from "react";

const options = {

    set token(token) {
        this.headers = {
            ...this.headers,
            Authorization: `Bearer ${token}`
        }
    },

    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

const useFetch = (url = '') => {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)

    const abortController = new AbortController()

    const handleRequest = ({
                               path,
                               method = 'GET',
                               headers = {},
                               body = null,
                               token = null
    }) => {

        setLoading(true)
        return fetch(url + path, {
            headers: {
                ...options.headers,
                ...headers
            },
            method: method,
            credentials: 'include',
            // mode: 'cors',
            ...(body && {body: JSON.stringify(body)}),
            signal: abortController.signal,
        })
            .then(res => res.json())
            .catch((error) => {
                console.log(error)
                setError(error.message)
            })
            .finally(() => {
                setLoading(false)
            });
    }

    const abort = () => {
        abortController.abort()
    }

    const get = (path = '/', init = { headers: {}, token: null}) => {
        return handleRequest({path: path, method: 'GET', ...init })
    }

    const post = (path = '/', body = {}, init = { headers: {}, token: null}) => {
        return handleRequest({path: path, body: body, method: 'POST', ...init })
    }

    return {
        loading,
        error,
        get,
        post,

        options,

        abort,
    }
}

export default useFetch;