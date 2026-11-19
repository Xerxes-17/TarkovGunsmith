import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import Home from './pages/home/Home';
import PageNotFound from './pages/not-found/PageNotFound';
import About from './pages/about/About';
import { LINKS } from './app/links';
import MwbBasePage from './pages/modded-weapon-builder/MwbBasePage';
import { MantineProvider } from '@mantine/core';
import AmmoMRT from './pages/data-sheets/AmmoMRT';
import { WeaponMRT } from './pages/data-sheets/WeaponMRT';
import { HelmetsMRT } from './pages/data-sheets/HelmetsMRT';
import { ArmorMRT } from './pages/data-sheets/ArmorMRT';
import { TgAppShell } from './app/TgAppShell';
import { ArmorModulesMRT } from './pages/data-sheets/ArmorModulesMRT';
import { BallisticsSimulator } from './pages/ballistics-simulator/BallisticsSimulator';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './app/SEO';
import { BallisticCalculator } from './pages/ballistic-calculator/BallisticCalculator';
import { AmmoEffectivenessPage } from './pages/ammo-effectiveness/AmmoEffectivenessPage';
import { TestPage } from './pages/test-page/TestPage';

function App() {
  return (
    <>
      <HelmetProvider>
        <SEO url="https://tarkovgunsmith.com" title={'Tarkov Gunsmith'} />
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
            colors: {
              'blurple': ['#e5e8ff', '#b7befd', '#8892f7', '#5966f2', '#2c3bed', '#1421d4', '#0d1aa6', '#071277', '#030a4a', '#00031e'],
            },
            breakpoints: {
              xs: '30em', // 480
              sm: '48em', // 766
              md: '64em', // 1024
              lg: '74em', // 1184
              xl: '1730px',
            },
            components: {
              Container: {
                defaultProps: {
                  sizes: {
                    xs: 540,
                    sm: 720,
                    md: 960,
                    lg: 1140,
                    xl: 1320,
                    xxl: 1780
                  },
                },
              },
            },
          }
          }>
          <BrowserRouter>
            <TgAppShell>
              {/* <Header /> */}
              <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path={LINKS.HOME} element={<Home />} />
                <Route path={LINKS.ABOUT} element={<About />} />
                <Route path={LINKS.MODDED_WEAPON_BUILDER} element={<MwbBasePage />} />
                <Route path={LINKS.DATA_SHEETS_WEAPONS} element={<WeaponMRT />} />
                <Route path={LINKS.DATA_SHEETS_AMMO} element={<AmmoMRT />} />

                <Route path={LINKS.DATA_SHEETS_PLATES_INSERTS} element={<ArmorModulesMRT />} />
                <Route path={LINKS.DATA_SHEETS_ARMOR_MODULES} element={<ArmorModulesMRT />} />
                <Route path={LINKS.DATA_SHEETS_HELMETS} element={<HelmetsMRT />} />
                <Route path={LINKS.DATA_SHEETS_ARMOR} element={<ArmorMRT />} />

                <Route path={LINKS.BALLISTICS_SIMULATOR} element={<BallisticsSimulator />} />

                <Route path={LINKS.BALLISTIC_CALCULATOR} element={<BallisticCalculator />} />

                <Route path={LINKS.AMMO_EFFECTIVENESS_CHART} element={<AmmoEffectivenessPage />} />

                <Route path={LINKS.TEST_PAGE} element={<TestPage />} />

                {/* Page not found */}
                <Route path='*' element={<PageNotFound />} />
              </Routes>

            </TgAppShell>

          </BrowserRouter>
        </MantineProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
