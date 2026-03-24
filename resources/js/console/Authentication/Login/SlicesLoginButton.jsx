import {Image} from "@mantine/core";
import OAuthLoginButton from "./OAuthLoginButton.jsx";
import {useAuthentication} from "../AuthenticationProvider.jsx";

const SlicesLoginButton = () => {
    const {setToken} = useAuthentication()

    const handleSuccess = ({ token, user }) => {
        setToken(token);
    };

    const handleError = (error) => {
        console.error("OAuth error:", error);
    };

    return (
        <OAuthLoginButton provider="Slices"
                          icon={<div><Image h={16} fit="contain" src="/images/slices/slices-ri-white-color.png" /></div>}
                          authUrl="/auth/slices"
                          onSuccess={handleSuccess}
                          onError={handleError}
        >
        </OAuthLoginButton>
    );
}

export default SlicesLoginButton;