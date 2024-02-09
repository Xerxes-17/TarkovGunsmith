import {
    AppShell,
    Footer,
    Box,
} from '@mantine/core';
import { OldBsHeaderNavbar } from '../OldBsHeaderNavbar';

export function TgAppShell(props: any) {
    return (
        <AppShell 
            layout='alt'
            styles={{
                main: {
                  paddingLeft:0,
                  paddingRight:0,
                  paddingBottom:0,
                  paddingTop:0
                },
              }}
            footer={
                <Footer className='tgAppShellFooter' height={{ base: 85, "539px": 65, "1002px": 40}} p="xs">
                    &copy; Copyright 2023. Created by Xerxes17.
                    Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved.
                </Footer>
            }
            header={
                <OldBsHeaderNavbar />
            }
        >
            <Box 
                mt={{base: 56}}
                mb={{base: 85, xs: 65, sm: 50, lg: 40}}
            >
                {props.children}
            </Box>

        </AppShell>
    );
}