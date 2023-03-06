import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import Header from './Components/Header';
import Home from './Components/Home';
import PageNotFound from './Components/PageNotFound';
import About from './Components/About';
import ModdedWeaponBuilder from './Components/MWB/ModdedWeaponBuilder';
import ArmorDamageCalculator from './Components/ADC/ArmorDamageCalculator';
import { ABOUT, ARMOR_DAMAGE_CALC, DATA_SHEETS_AMMO, DATA_SHEETS_ARMOR, DATA_SHEETS_EFFECTIVENESS_ARMOR, DATA_SHEETS_WEAPONS, HOME, MODDED_WEAPON_BUILDER, DATA_SHEETS_EFFECTIVENESS_AMMO, DATA_SHEETS_EFFECTIVENESS_AMMO_SIMPLE } from './Util/links';
import DataSheetAmmo from './Components/DataSheets/DataSheetAmmo';
import DataSheetArmor from './Components/DataSheets/DataSheetArmor';
import DataSheetWeapons from './Components/DataSheets/DataSheetWeapons';
import DataSheetEffectivenessArmor from './Components/DataSheets/DataSheetEffectivenessArmor';
import DataSheetEffectivenessAmmo from './Components/DataSheets/DataSheetEffectivenessAmmo';
import SimplifiedAmmoRatingsTable from './Components/DataSheets/SimplifiedAmmoRatingsTable';

function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Container className='main-app-container'>

          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path={HOME} element={<Home />} />
            <Route path={ABOUT} element={<About />} />
            <Route path={MODDED_WEAPON_BUILDER} element={<ModdedWeaponBuilder />} />
            <Route path={ARMOR_DAMAGE_CALC} element={<ArmorDamageCalculator />} />

            <Route path={DATA_SHEETS_AMMO} element={<DataSheetAmmo />} />
            <Route path={DATA_SHEETS_ARMOR} element={<DataSheetArmor />} />
            <Route path={DATA_SHEETS_WEAPONS} element={<DataSheetWeapons />} />
            <Route path={DATA_SHEETS_EFFECTIVENESS_ARMOR} element={<DataSheetEffectivenessArmor />} />
            <Route path={DATA_SHEETS_EFFECTIVENESS_AMMO} element={<DataSheetEffectivenessAmmo />} />
            <Route path={DATA_SHEETS_EFFECTIVENESS_AMMO_SIMPLE} element={<SimplifiedAmmoRatingsTable />} />

            {/* Page not found */}
            <Route path='*' element={<PageNotFound />} />
          </Routes>



        </Container>
        <footer>
          &copy; Copyright 2023. Created by Xerxes17.
          Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved.
        </footer>
      </BrowserRouter>
    </>
  );
}

export default App;
