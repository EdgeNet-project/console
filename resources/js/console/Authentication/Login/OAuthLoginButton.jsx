import React from "react";
import {Button} from "@mantine/core";

export default function OAuthLoginButton({
                                             provider,
    icon, classes,
                                             authUrl,
                                             onSuccess,
                                             onError,
                                             children,
                                             width = 600,
                                             height = 700,
                                         }) {
    const openPopup = () => {
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            authUrl,
            `${provider}-login`,
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
            onError?.(new Error("Popup blocked"));
            return;
        }

        const listener = (event) => {
            if (!event.data) return;

            if (event.data.type === `${provider}-auth-success`) {
                window.removeEventListener("message", listener);
                popup.close();
                onSuccess?.(event.data);
            }

            if (event.data.type === `${provider}-auth-error`) {
                window.removeEventListener("message", listener);
                popup.close();
                onError?.(event.data.error);
            }
        };

        window.addEventListener("message", listener);
    };

    return (
        <Button onClick={openPopup}
                leftSection={icon}
                className={classes.githubButton}>
            Login with {provider}
        </Button>
    );
}