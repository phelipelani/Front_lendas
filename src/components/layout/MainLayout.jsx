import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import logoLendas from "../../assets/Logo.png"; // CORRIGIDO

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  padding: clamp(15px, 4vw, 20px);

  @media (max-height: 600px) {
    padding: 10px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(25px, 6vw, 40px);
  width: 100%;
  max-width: 1200px;

  @media (min-width: 768px) and (orientation: landscape) {
    flex-direction: row;
    justify-content: space-around;
    gap: clamp(40px, 8vw, 60px);
  }

  @media (max-height: 600px) and (orientation: landscape) {
    gap: clamp(20px, 5vw, 30px);
  }
`;

const LogoLink = styled(Link)`
  display: block;
  flex-shrink: 0;
`;

const LogoImage = styled.img`
  width: clamp(150px, 30vw, 200px);
  height: auto;
  transition: transform 0.3s ease;
  max-width: 90vw;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 768px) and (orientation: landscape) {
    width: clamp(200px, 25vw, 280px);
  }

  @media (max-height: 600px) and (orientation: landscape) {
    width: clamp(120px, 20vw, 180px);
  }
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  flex: 1;

  @media (min-width: 768px) and (orientation: landscape) {
    max-width: 600px;
  }

  @media (max-height: 600px) and (orientation: landscape) {
    max-width: 450px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const MainLayout = () => {
  const location = useLocation();
  const showLogo = location.pathname !== "/";

  return (
    <PageContainer>
      <ContentWrapper>
        {showLogo && (
          <LogoLink to="/">
            <LogoImage src={logoLendas} alt="Logo Lendas" />
          </LogoLink>
        )}
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentWrapper>
    </PageContainer>
  );
};

export default MainLayout;