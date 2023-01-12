import {useEffect, useState} from "react";
import axios from "axios";
import {
    LoadingOverlay
} from '@mantine/core';
import { Panel } from "../../UI";
import {useParams} from "react-router-dom";

export default function EmailVerification() {
    const [ loading, setLoading ] = useState(false)
    const { id, hash } = useParams()

    useEffect(() => {
        console.log('params',id,hash)
        setLoading(true)
        axios.get('/api/email/verify/' + id + '/' + hash)
            .then((res) => {
                console.log(res)
            })
            .catch(({message, response: {data: {errors}}}) => {
                // console.log(message)
                // setErrors(errors)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])


    return (
        <Panel>

                    Email Verification

                    <LoadingOverlay visible={loading} overlayBlur={2} />


        </Panel>
    );


}