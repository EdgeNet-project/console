import React, {useEffect, useState} from "react";
import { createRoot } from 'react-dom/client';
import { useRemote } from '@terminal/remote';

const defaults = {
    url: 'http://localhost:8000',
}

const Test1 = () => {
    const { request, loading } = useRemote(defaults);
    const [ data1, setData1 ] = useState()


    useEffect(() => {
        // console.log('a', request.defaults)
        // request.defaults.url = 'http://localhost:6666'
        // console.log('b', request.defaults)

        request.get({
            path: '/test1',
            query: {page: 1}
        }).then(data => setData1(data))
    }, [])

    if (loading) {
        return <div>Loading1</div>
    }

    if (!data1) {
        return <div>no data1</div>
    }

    return (
            <div>
                Response1: {JSON.stringify(data1)}
            </div>
    )
}

const Test2 = () => {
    const { request, loading } = useRemote(defaults);
    const [ data2, setData2 ] = useState()

    useEffect(() => {
        // console.log('a', request.defaults)
        // request.defaults.url = 'http://localhost:6666'
        // console.log('b', request.defaults)

        request.get({
            path: '/test2',
            query: {page: 1}
        })
            .then(data => setData2(data))
            .catch((error) => {
                console.log('catch', error)
            })
    }, [])


    if (loading) {
        return <div>Loading2</div>
    }

    return (
            <div>
                Response2: {JSON.stringify(data2)}
            </div>
    )
}

const container = document.getElementById('test');
const root = createRoot(container)
    .render(<><Test1 /><Test2 /></>);
