import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/globalStyles';
import theme from './styles/theme';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import LifeSkillsPage from './pages/LifeSkillsPage';
import { PortfolioProvider } from './context/PortfolioContext';
import ScrollProgressBar from './components/ui/ScrollProgressBar';
import LoadingScreen from './components/ui/LoadingScreen';
import CursorTrail from './components/ui/CursorTrail';
import Chatbot from './components/common/Chatbot';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <PortfolioProvider>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} minDuration={1800} />}
        {!isLoading && (
          <>
            <ScrollProgressBar />
            <CursorTrail />
            <Chatbot />
            <Router>
              <Routes>
                <Route path="/" element={
                  <Layout transparentHeader>
                    <HomePage />
                  </Layout>
                } />
                <Route path="/projects" element={
                  <Layout>
                    <ProjectsPage />
                  </Layout>
                } />
                <Route path="/project/:id" element={
                  <Layout>
                    <ProjectDetailPage />
                  </Layout>
                } />
                <Route path="/life-skills" element={
                  <Layout>
                    <LifeSkillsPage />
                  </Layout>
                } />
              </Routes>
            </Router>
          </>
        )}
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;
