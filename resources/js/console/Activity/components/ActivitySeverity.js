import {Badge} from "@mantine/core";

export default ({severity}) => {
    let color = '';

    switch(severity) {
        case "error":
            color = "red";
            break;
        case "warning":
            color = "orange";
            break;
        default:
        case "info":
            color = "blue";
            break;
    }

    return (
        <Badge color={color} variant="light">
            {severity ?? 'info'}
        </Badge>
    )
}