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
import { ABOUT, ARMOR_DAMAGE_CALC, DATA_SHEETS, HOME, MODDED_WEAPON_BUILDER } from './Util/links';
import DataSheetsBase from './Components/DataSheets/DataSheetsBase';
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
            <Route path={DATA_SHEETS} element={<DataSheetsBase />} />

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
