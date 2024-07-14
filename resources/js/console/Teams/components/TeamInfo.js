import {Anchor, Text} from "@mantine/core";

export default ({team}) => {

    return (
        <>
            {/*<Text fz="xs" tt="uppercase" c="dimmed">*/}
            {/*    {team.name}*/}
            {/*</Text>*/}
            <Text size="sm">
                {team.fullname} ({team.shortname})<br />
            </Text>
            <Text size="xs">
                {team.city} {team.country}
            </Text>
            <Anchor size="xs" target="_blank" href={team.url}>{team.url}</Anchor>
        </>
    )
}