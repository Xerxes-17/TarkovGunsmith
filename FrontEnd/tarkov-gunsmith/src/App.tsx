import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
// import Header from './Components/Header';
import Home from './Components/Home';
import PageNotFound from './Components/PageNotFound';
import About from './Components/About';
import ModdedWeaponBuilder from './Components/MWB/ModdedWeaponBuilder';
import ArmorDamageCalculator from './Components/ADC/ArmorDamageCalculator';
import { LINKS } from './Util/links';
import DataSheetAmmo from './Components/DataSheets/Stats_Ammo';
import DataSheetArmor from './Components/DataSheets/Stats_Armor';
import DataSheetWeapons from './Components/DataSheets/Stats_Weapons';
import DataSheetEffectivenessArmor from './Components/DataSheets/ArmorVsAmmo';
import DataSheetEffectivenessAmmo from './Components/DataSheets/AmmoVsArmor';
import AmmoEffectivenessChartPage from './Components/AEC/NewAEC';
import MwbBasePage from './Components/MWB/MwbBasePage';
import Header from './Components/Header';
import { AppShell, Aside, Footer, MantineProvider, MediaQuery, Navbar, Header as ManHeader, Text, Burger, useMantineTheme, createStyles, Code, Group, ScrollArea, rem } from '@mantine/core';
import { useState } from 'react';
import { ManNavbar } from './Components/MyMantine/ManNavbar';
import { LinksGroup } from './Components/MyMantine/ManLinksGroup';
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from '@tabler/icons-react';

const mockdata = [
  { label: 'Modded Weapon Builder', icon: IconGauge },
  { label: 'Terminal Ballistics Simulator', icon: IconGauge },
  { label: 'Ammo Effectiveness Chart', icon: IconGauge },
  { label: 'Ammo Effectiveness Chart', icon: IconGauge },



  {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: IconPresentationAnalytics },
  { label: 'Contracts', icon: IconFileAnalytics },
  { label: 'Settings', icon: IconAdjustments, link: '/' },
  {
    label: 'Security',
    icon: IconLock,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  links: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },

  linksInner: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
  },
}));
function App() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { classes } = useStyles();
  const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
  
  return (
    <>
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>

        <BrowserRouter>
          <AppShell
            layout="alt"
            styles={{
              main: {
                background: theme.colors.dark[8],
              },
            }}
            navbarOffsetBreakpoint="sm"
            asideOffsetBreakpoint="sm"
            navbar={
              <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
                <Navbar.Section className={classes.header}>
                  <Group position="apart">
                    <img
                      alt=""
                      src="/TG_icon.png"
                      width="30"
                      height="30"
                      className="d-inline-block align-top"
                    />
                    Tarkov Gunsmith
                    <Code sx={{ fontWeight: 700 }}>v3.1.2</Code>
                  </Group>
                </Navbar.Section>

                <Navbar.Section grow className={classes.links} component={ScrollArea}>
                  <div className={classes.linksInner}>{links}</div>
                </Navbar.Section>

                <Navbar.Section className={classes.footer}>
                  {/* <UserButton
          image="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
          name="Ann Nullpointer"
          email="anullpointer@yahoo.com"
        /> */}
                </Navbar.Section>
              </Navbar>
            }
            header={
              <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                <ManHeader height={{ base: 50, md: 70 }} p="md">
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>

                    <Burger
                      opened={opened}
                      onClick={() => setOpened((o) => !o)}
                      size="sm"
                      color={theme.colors.gray[6]}
                      mr="xl"
                    />



                  </div>
                </ManHeader>
              </MediaQuery>
            }
          >
            {/* <Routes>

              <Route path={"/"} element={<Home />} />
              <Route path={LINKS.HOME} element={<Home />} />
              <Route path={LINKS.ABOUT} element={<About />} />
              <Route path={LINKS.MODDED_WEAPON_BUILDER} element={<MwbBasePage />} />
              <Route path={LINKS.DAMAGE_SIMULATOR} element={<ArmorDamageCalculator />} />
              <Route path={`${LINKS.DAMAGE_SIMULATOR}/:id_armor/:id_ammo`} element={<ArmorDamageCalculator />} />
              <Route path={`${LINKS.DAMAGE_SIMULATOR}/:id_armor/`} element={<ArmorDamageCalculator />} />
              <Route path={`${LINKS.DAMAGE_SIMULATOR}//:id_ammo`} element={<ArmorDamageCalculator />} />

              <Route path={LINKS.DATA_SHEETS_AMMO} element={<DataSheetAmmo />} />

              <Route path={LINKS.DATA_SHEETS_ARMOR} element={<DataSheetArmor />} />
              <Route path={LINKS.DATA_SHEETS_WEAPONS} element={<DataSheetWeapons />} />

              <Route path={LINKS.ARMOR_VS_AMMO} element={<DataSheetEffectivenessArmor />} />
              <Route path={`${LINKS.ARMOR_VS_AMMO}/:id_armor`} element={<DataSheetEffectivenessArmor />} />

              <Route path={LINKS.AMMO_VS_ARMOR} element={<DataSheetEffectivenessAmmo />} />
              <Route path={`${LINKS.AMMO_VS_ARMOR}/:id_ammo`} element={<DataSheetEffectivenessAmmo />} />

              <Route path={LINKS.AMMO_EFFECTIVENESS_CHART} element={<AmmoEffectivenessChartPage />} />

              <Route path='*' element={<PageNotFound />} />

            </Routes> */}
            {/* <footer>
              &copy; Copyright 2023. Created by Xerxes17.
              Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved.
            </footer> */}
            <Text>Resize app to see responsive navbar in action</Text>
          </AppShell>
        </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
