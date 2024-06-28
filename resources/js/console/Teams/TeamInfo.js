import {Anchor, Text} from "@mantine/core";

export default ({team}) => {

    return (
        <div>
            <Text fz="xs" tt="uppercase" c="dimmed">
                {team.name} ({team.shortname})
            </Text>
            <Text fz="md">
                {team.fullname} <br />
                {team.city} {team.country}
            </Text>
            <Anchor target="_blank" href={team.url}>{team.url}</Anchor>
        </div>
    )
}