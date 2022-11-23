import { useState } from "react";
import { useAuth } from "../Authentication";

const useFetch = (url = '') => {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const { token } = useAuth()

    const abortController = new AbortController()

    const handleRequest = ({ path, method = 'GET', headers = {}, body = null}) => {
        setLoading(true)

        return fetch(url + path, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...headers
            },
            method: method,
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

    const get = (path = '/', init = { headers: {}}) => {
        return handleRequest({path: path, method: 'GET', headers: init.headers })
    }

    const post = (path = '/', body = {}, init = { headers: {}}) => {
        return handleRequest({path: path, body: body, method: 'POST', headers: init.headers })
    }

    return {
        loading,
        error,
        get,
        post,

        abort,
    }
}

export default useFetch;