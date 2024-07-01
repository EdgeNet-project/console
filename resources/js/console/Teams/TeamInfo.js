import {Anchor, Text} from "@mantine/core";

export default ({team}) => {

    return (
        <div>
            {/*<Text fz="xs" tt="uppercase" c="dimmed">*/}
            {/*    {team.name}*/}
            {/*</Text>*/}
            <Text fz="sm">
                {team.fullname} ({team.shortname})<br />
            </Text>
            <Text fz="xs">
                {team.city} {team.country}
            </Text>
            <Anchor fz="xs" target="_blank" href={team.url}>{team.url}</Anchor>
        </div>
    )
}