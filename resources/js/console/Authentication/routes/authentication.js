import React from "react";
import {createBrowserRouter, redirect, RouterProvider, Outlet} from "react-router-dom";

import Authentication from "../Views/Authentication";
import Login from "../Login/LoginForm";
import UserRegistration from "../Registration/UserRegistration";
import EmailVerification from "../Registration/EmailVerification";
import PasswordResetLink from "../Login/PasswordResetLink";
import PasswordResetForm from "../Login/PasswordResetForm";


export default createBrowserRouter([
    {
        path: "/",
        element: <Authentication />,
        loader: null,
        action: null, // login
        children: [
            {
                path: "/",
                element: <Login />,
            },
            {
                path: "/registration",
                element: <UserRegistration />,
                loader: null,
            },
            {
                path: "/email/verify/:id/:hash",
                element: <EmailVerification />,
            },
            {
                path: "/password",
                element: <PasswordResetLink />,
                loader: null,
                action: null, // forgot password
                children: [
                    // {
                    //     path: "team",
                    //     element: null,
                    //     loader: null,
                    // },
                ],
            },
            {
                path: "/password/reset/:id/:signature",
                element: <PasswordResetForm />,
                loader: null,
                action: null, // forgot password
                children: [
                    // {
                    //     path: "team",
                    //     element: null,
                    //     loader: null,
                    // },
                ],
            },
        ],
    },



]);