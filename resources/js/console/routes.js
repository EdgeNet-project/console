import {
    createBrowserRouter,
} from "react-router-dom";
import Application from "./Application";
import {UserRegistrationForm} from "./Authentication/Registration/UserRegistrationForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Application />,
        loader: null,
        children: [
            {
                path: "registration",
                element: <UserRegistrationForm />,
                loader: null,
            },
        ],
    },
]);

export default router;