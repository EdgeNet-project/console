import {Container} from "@mantine/core";
import Navigation from "./Navigation";
import {useAuthentication} from "../Authentication";


const Application = () => {
    const { isAuthenticated } = useAuthentication()

    if (isAuthenticated) {
        return 'authenticated'
    }

    return (
         'login'
    )

    // <RouterProvider router={router} />
}

export default Application;