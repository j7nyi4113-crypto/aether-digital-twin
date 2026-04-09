/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Mechanical from './pages/Mechanical';
import PowerCore from './pages/PowerCore';
import AeroKit from './pages/AeroKit';
import Lightweight from './pages/Lightweight';
import Surface from './pages/Surface';
import Acoustic from './pages/Acoustic';
import Ecosystem from './pages/Ecosystem';
import DesignBrief from './pages/DesignBrief';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="mechanical" element={<Mechanical />} />
        <Route path="power" element={<PowerCore />} />
        <Route path="aero" element={<AeroKit />} />
        <Route path="lightweight" element={<Lightweight />} />
        <Route path="surface" element={<Surface />} />
        <Route path="acoustic" element={<Acoustic />} />
        <Route path="ecosystem" element={<Ecosystem />} />
        <Route path="design-brief" element={<DesignBrief />} />
      </Route>
    </Routes>
  );
}
