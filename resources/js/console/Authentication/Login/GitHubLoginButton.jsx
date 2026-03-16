import {GithubIcon} from "@mantinex/dev-icons";
import OAuthLoginButton from "./OAuthLoginButton.jsx";
import {useAuthentication} from "../AuthenticationProvider.jsx";

const GithubLoginButton = () => {
    const {setToken} = useAuthentication()

    const handleSuccess = ({ token, user }) => {
        setToken(token);
    };

    const handleError = (error) => {
        console.error("OAuth error:", error);
    };

    return (
        <OAuthLoginButton provider="GitHub"
                          icon={<GithubIcon size={16} />}
                          authUrl="/auth/github"
                          onSuccess={handleSuccess}
                          onError={handleError}
        >
        </OAuthLoginButton>
    );
}

export default GithubLoginButton;