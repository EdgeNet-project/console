import {NavLink as RouterNavLink, useMatch} from "react-router-dom";
import {NavLink} from "@mantine/core";
import classes from "./navigation.module.css";

export default ({to, label, icon, rightSection}) => {
    const match = useMatch(to)

    return (
        <NavLink
            component={RouterNavLink}
            className={classes.link}
            to={to}
            label={label}
            active={match}
            leftSection={icon}
            rightSection={rightSection}
        />
    )
}