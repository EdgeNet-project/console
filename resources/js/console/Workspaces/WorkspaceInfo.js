import {Anchor, Text} from "@mantine/core";

export default ({workspace}) => {

    return (
        <div>
            <Text>
                {workspace.name}
            </Text>
            {workspace.team && <><Text fz="xs" c="dimmed">
                {workspace.team.name} ({workspace.team.shortname}) <br />
                {workspace.team.fullname} <br />
                {workspace.team.city} {workspace.team.country}
            </Text>
            <Anchor target="_blank" href={workspace.team.url}>{workspace.team.url}</Anchor></>}
        </div>
    )
}