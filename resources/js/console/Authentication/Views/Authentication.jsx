import {
    SimpleGrid, Image, Stack, Text, Group, Title,
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import React from "react";

const style = {
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100vh'
};

export function Authentication() {

    return (
        <SimpleGrid cols={2}>
            <div style={style}>
                <div style={{marginBottom:25}}>
                    <Image src={console_app.logo.login ?? "/images/edgenet-logo.png"}
                           alt={console_app.name ?? 'EdgeNet'}
                           height={console_app.logo.login_height ?? 80}
                           fit="contain" />
                </div>
                    <div style={{width:'50%'}}>
                        <Outlet />
                    </div>
            </div>
            <div style={style}>
                <img style={{width:'90%', marginRight:'auto'}} src="/images/platforms.png" alt="EdgeNet" />
            </div>
        </SimpleGrid>
    );
}

export default Authentication;