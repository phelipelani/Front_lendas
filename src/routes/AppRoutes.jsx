import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LigasPage from '../pages/LigasPage';
import LigaDetailPage from '../pages/LigaDetailPage';
import RodadaPage from '../pages/RodadaPage';
import SorteioPage from '../pages/SorteioPage';
import PartidasPage from '../pages/PartidasPage';
import ResultadoRodadaPage from '../pages/ResultadoRodadaPage';
import EstatisticasPage from '../pages/EstatisticasPage'; // <-- NOVO
import MainLayout from '../components/layout/MainLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route element={<MainLayout />}>
        <Route path="/ligas" element={<LigasPage />} />
        <Route path="/liga/:ligaId" element={<LigaDetailPage />} />
        <Route path="/liga/:ligaId/rodada/:rodadaId" element={<RodadaPage />} />
        <Route path="/estatisticas" element={<EstatisticasPage />} /> {/* <-- NOVO */}
      </Route>

      <Route path="/liga/:ligaId/rodada/:rodadaId/sorteio" element={<SorteioPage />} />
      <Route path="/liga/:ligaId/rodada/:rodadaId/partidas" element={<PartidasPage />} />
      <Route path="/liga/:ligaId/rodada/:rodadaId/resultados" element={<ResultadoRodadaPage />} />
    </Routes>
  );
};

export default AppRoutes;
