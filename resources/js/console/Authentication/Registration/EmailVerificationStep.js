import {useEffect, useState} from "react";
import axios from "axios";
import {
    Button,
    LoadingOverlay
} from '@mantine/core';

export default function EmailVerificationStep() {
    const [ loading, setLoading ] = useState(false)

    const sendVerificationLink = () => {
        setLoading(true)
        axios.post('/email/verification')
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
    }


    return (
        <>
            <p>
            Your Email has not been verified yet. Please use the button below if you
            haven't received a validation email (And please also check your SPAM folder).
            </p>

            <Button disabled={loading} onClick={sendVerificationLink}>
                Send a verification link
            </Button>

            {loading && <LoadingOverlay visible={loading} overlayBlur={2} />}


        </>
    );


}