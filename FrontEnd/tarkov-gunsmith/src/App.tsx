import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
// import {Header} from './Components/Header';
import Home from './Components/Home';
import PageNotFound from './Components/PageNotFound';
import About from './Components/About';
import ArmorDamageCalculator from './Components/ADC/ArmorDamageCalculator';
import { LINKS } from './Util/links';
import DataSheetAmmo from './Components/DataSheets/Stats_Ammo';
import DataSheetArmor from './Components/DataSheets/Stats_Armor';
import DataSheetWeapons from './Components/DataSheets/Stats_Weapons';
import DataSheetEffectivenessArmor from './Components/DataSheets/ArmorVsAmmo';
import DataSheetEffectivenessAmmo from './Components/DataSheets/AmmoVsArmor';
import AmmoEffectivenessChartPage from './Components/AEC/NewAEC';
import MwbBasePage from './Components/MWB/MwbBasePage';
import { MantineProvider } from '@mantine/core';
import AmmoMRT from './Pages/AmmoTable/AmmoMRT';
import { WeaponMRT } from './Pages/WeaponTable/WeaponMRT';
import { DataSheetArmorModules } from './Components/DataSheets/Stats_ArmorModules';
import { HelmetsMRT } from './Pages/HelmetTable/HelmetsMRT';
import { ArmorMRT } from './Pages/ArmorTable/ArmorMRT';
import { TgAppShell } from './Components/Common/TgAppShell';
import { ArmorModulesMRT } from './Pages/ArmorModulesTable/ArmorModulesMRT';

function App() {

  return (
    <>
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <BrowserRouter>
          <TgAppShell>
            {/* <Header /> */}
            <Routes>
              <Route path={"/"} element={<Home />} />
              <Route path={LINKS.HOME} element={<Home />} />
              <Route path={LINKS.ABOUT} element={<About />} />
              <Route path={LINKS.MODDED_WEAPON_BUILDER} element={<MwbBasePage />} />
              {/* <Route path={LINKS.DAMAGE_SIMULATOR} element={<ArmorDamageCalculator />} />
            <Route path={`${LINKS.DAMAGE_SIMULATOR}/:id_armor/:id_ammo`} element={<ArmorDamageCalculator />} />
            <Route path={`${LINKS.DAMAGE_SIMULATOR}/:id_armor/`} element={<ArmorDamageCalculator />} />
            <Route path={`${LINKS.DAMAGE_SIMULATOR}//:id_ammo`} element={<ArmorDamageCalculator />} /> */}

              <Route path={LINKS.DATA_SHEETS_WEAPONS} element={<WeaponMRT />} />
              <Route path={LINKS.DATA_SHEETS_AMMO} element={<AmmoMRT />} />

              <Route path={LINKS.DATA_SHEETS_PLATES_INSERTS} element={<DataSheetArmorModules />} />
              <Route path={LINKS.DATA_SHEETS_ARMOR_MODULES} element={<ArmorModulesMRT />} />
              <Route path={LINKS.DATA_SHEETS_HELMETS} element={<HelmetsMRT />} />
              <Route path={LINKS.DATA_SHEETS_ARMOR} element={<ArmorMRT />} />


              {/* <Route path={LINKS.ARMOR_VS_AMMO} element={<DataSheetEffectivenessArmor />} />
            <Route path={`${LINKS.ARMOR_VS_AMMO}/:id_armor`} element={<DataSheetEffectivenessArmor />} />

            <Route path={LINKS.AMMO_VS_ARMOR} element={<DataSheetEffectivenessAmmo />} />
            <Route path={`${LINKS.AMMO_VS_ARMOR}/:id_ammo`} element={<DataSheetEffectivenessAmmo />} />

            <Route path={LINKS.AMMO_EFFECTIVENESS_CHART} element={<AmmoEffectivenessChartPage/>} /> */}

              {/* Page not found */}
              <Route path='*' element={<PageNotFound />} />
            </Routes>

          </TgAppShell>

        </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
