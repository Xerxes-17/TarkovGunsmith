import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import Header from './Components/Header';
import Home from './Components/Home';
import PageNotFound from './Components/PageNotFound';
import About from './Components/About';
import ModdedWeaponBuilder from './Components/MWB/ModdedWeaponBuilder';
import ArmorDamageCalculator from './Components/ADC/ArmorDamageCalculator';
import { ABOUT, DAMAGE_SIMULATOR, DATA_SHEETS_AMMO, DATA_SHEETS_ARMOR, ARMOR_VS_AMMO, DATA_SHEETS_WEAPONS, HOME, MODDED_WEAPON_BUILDER, AMMO_VS_ARMOR, AMMO_EFFECTIVENESS_CHART } from './Util/links';
import DataSheetAmmo from './Components/DataSheets/Stats_Ammo';
import DataSheetArmor from './Components/DataSheets/Stats_Armor';
import DataSheetWeapons from './Components/DataSheets/Stats_Weapons';
import DataSheetEffectivenessArmor from './Components/DataSheets/ArmorVsAmmo';
import DataSheetEffectivenessAmmo from './Components/DataSheets/AmmoVsArmor';
import SimplifiedAmmoRatingsTable from './Components/DataSheets/AmmoEffectivenessChart';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={HOME} element={<Home />} />
            <Route path={ABOUT} element={<About />} />
            <Route path={MODDED_WEAPON_BUILDER} element={<ModdedWeaponBuilder />} />
            <Route path={DAMAGE_SIMULATOR} element={<ArmorDamageCalculator />} />
            <Route path={`${DAMAGE_SIMULATOR}/:id_armor/:id_ammo`} element={<ArmorDamageCalculator />} />
            <Route path={`${DAMAGE_SIMULATOR}/:id_armor/`} element={<ArmorDamageCalculator />} />
            <Route path={`${DAMAGE_SIMULATOR}//:id_ammo`} element={<ArmorDamageCalculator />} />

            <Route path={DATA_SHEETS_AMMO} element={<DataSheetAmmo />} />
            

            <Route path={DATA_SHEETS_ARMOR} element={<DataSheetArmor />} />
            <Route path={DATA_SHEETS_WEAPONS} element={<DataSheetWeapons />} />

            <Route path={ARMOR_VS_AMMO} element={<DataSheetEffectivenessArmor />} />
            <Route path={`${ARMOR_VS_AMMO}/:id_armor`} element={<DataSheetEffectivenessArmor />} />

            <Route path={AMMO_VS_ARMOR} element={<DataSheetEffectivenessAmmo />} />
            <Route path={`${AMMO_VS_ARMOR}/:id_ammo`} element={<DataSheetEffectivenessAmmo />} />

            <Route path={AMMO_EFFECTIVENESS_CHART} element={<SimplifiedAmmoRatingsTable />} />

            {/* Page not found */}
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        <footer>
          &copy; Copyright 2023. Created by Xerxes17.
          Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved.
        </footer>
      </BrowserRouter>
    </>
  );
}

export default App;
