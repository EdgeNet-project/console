import { Tabs } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons';
import { useNavigate, useParams } from 'react-router-dom';

const Navigation = () => {
    const navigate = useNavigate();
    const { tabValue } = useParams();

    return (
        <Tabs defaultValue="gallery" value={tabValue} onTabChange={(value) => navigate(`/${value}`)}>
            <Tabs.List>
                <Tabs.Tab value="dashboard" icon={<IconPhoto size={14} />}>Gallery</Tabs.Tab>
                <Tabs.Tab value="messages" icon={<IconMessageCircle size={14} />}>Messages</Tabs.Tab>
                <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>Settings</Tabs.Tab>
            </Tabs.List>
        </Tabs>
    );
}

export default Navigation;