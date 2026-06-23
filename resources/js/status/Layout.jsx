import {useMediaQuery} from "@mantine/hooks";
import {Stack} from "@mantine/core";
import {Outlet} from "react-router-dom";

const Layout = () => {
    const medium = useMediaQuery('(min-width: 801px)');
    const large = useMediaQuery('(min-width: 1600px)');

    return (
        <Stack>
            <Outlet />
        </Stack>
    )
}

export default Layout;