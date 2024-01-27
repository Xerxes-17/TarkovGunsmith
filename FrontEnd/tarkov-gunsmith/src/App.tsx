import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import Header from './Components/Header';
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
import AmmoTableContent from './Pages/AmmoTable/AmmoTable';
import WeaponTableContent from './Pages/WeaponTable/WeaponTable';
import { DataSheetArmorModules } from './Components/DataSheets/Stats_ArmorModules';

function App() {

  return (
    <>
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>

      <BrowserRouter>
        <Header />
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={LINKS.HOME} element={<Home />} />
            <Route path={LINKS.ABOUT} element={<About />} />
            <Route path={LINKS.MODDED_WEAPON_BUILDER} element={<MwbBasePage />} />
            {/* <Route path={LINKS.DAMAGE_SIMULATOR} element={<ArmorDamageCalculator />} />
            <Route path={`${LINKS.DAMAGE_SIMULATOR}/:id_armor/:id_ammo`} element={<ArmorDamageCalculator />} />
            <Route path={`${LINKS.DAMAGE_SIMULATOR}/:id_armor/`} element={<ArmorDamageCalculator />} />
            <Route path={`${LINKS.DAMAGE_SIMULATOR}//:id_ammo`} element={<ArmorDamageCalculator />} /> */}

            <Route path={LINKS.DATA_SHEETS_WEAPONS} element={<DataSheetWeapons />} />
            <Route path={LINKS.DATA_SHEETS_AMMO} element={<DataSheetAmmo />} />
            <Route path={LINKS.DATA_SHEETS_AMMO_new} element={<AmmoTableContent />} />
            
            <Route path={LINKS.DATA_SHEETS_PLATES_INSERTS} element={<DataSheetArmorModules />} />
            {/* <Route path={LINKS.DATA_SHEETS_ARMOR} element={<DataSheetArmor />} /> */}
            

            {/* <Route path={LINKS.ARMOR_VS_AMMO} element={<DataSheetEffectivenessArmor />} />
            <Route path={`${LINKS.ARMOR_VS_AMMO}/:id_armor`} element={<DataSheetEffectivenessArmor />} />

            <Route path={LINKS.AMMO_VS_ARMOR} element={<DataSheetEffectivenessAmmo />} />
            <Route path={`${LINKS.AMMO_VS_ARMOR}/:id_ammo`} element={<DataSheetEffectivenessAmmo />} />

            <Route path={LINKS.AMMO_EFFECTIVENESS_CHART} element={<AmmoEffectivenessChartPage/>} /> */}

            {/* Page not found */}
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        <footer>
          &copy; Copyright 2023. Created by Xerxes17.
          Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved.
        </footer>
      </BrowserRouter>
      </MantineProvider>
    </>
  );
}

export default App;
