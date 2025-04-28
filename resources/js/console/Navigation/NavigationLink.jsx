import {NavLink as RouterNavLink, useMatch} from "react-router-dom";
import {NavLink} from "@mantine/core";

export default ({to, label, icon, rightSection, color, children}) => {
    const match = useMatch(to)

    return (
        <NavLink
            component={RouterNavLink}
            to={to}
            label={label}
            active={match}
            leftSection={icon}
            rightSection={rightSection}
            color={color}>{children}</NavLink>
    )
}