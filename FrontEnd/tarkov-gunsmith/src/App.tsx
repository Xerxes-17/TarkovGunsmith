import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter, Route, Routes
} from "react-router-dom";
import { Col, Container, Row } from 'react-bootstrap';
import Header from './Components/Header';
import Home from './Components/Home';
import PageNotFound from './Components/PageNotFound';
import About from './Components/About';
import ModdedWeaponBuilder from './Components/MWB/ModdedWeaponBuilder';
import ArmorDamageCalculator from './Components/ADC/ArmorDamageCalculator';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Container className="main-container">
          <Row className="justify-content-md-center">
            <Col md="auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/moddedweaponbuilder" element={<ModdedWeaponBuilder />} />
                <Route path="/armordamagecalculator" element={<ArmorDamageCalculator />} />

                {/* Page not found */}
                <Route path='*' element={<PageNotFound />} />

              </Routes>
            </Col>
          </Row>
        </Container>
        <footer>
          &copy; Copyright 2023. Created by R.Forsey.
          Game content and materials are trademarks and copyrights of Battlestate Games and its licensors. All rights reserved.
        </footer>
      </BrowserRouter>
    </>
  );
}

export default App;
