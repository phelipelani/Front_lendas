import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/common/Button";
import logoLendas from "../assets/Logo.png"; // CORRIGIDO

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
  gap: clamp(30px, 8vw, 50px);
  width: 100%;
  max-width: 1200px;

  @media (min-width: 768px) and (orientation: landscape) {
    flex-direction: row;
    justify-content: center;
    gap: clamp(40px, 10vw, 80px);
  }

  @media (max-height: 600px) and (orientation: landscape) {
    gap: clamp(20px, 6vw, 40px);
  }
`;

const LogoImage = styled.img`
  width: clamp(200px, 40vw, 250px);
  height: auto;
  max-width: 90vw;

  @media (min-width: 768px) and (orientation: landscape) {
    width: clamp(250px, 25vw, 300px);
  }

  @media (max-height: 600px) and (orientation: landscape) {
    width: clamp(150px, 20vw, 200px);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 4vw, 20px);
  width: 100%;
  max-width: 300px;
  align-items: center;

  @media (max-height: 600px) and (orientation: landscape) {
    gap: clamp(10px, 3vw, 15px);
    max-width: 250px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 0 20px;
  }
`;

const HomePage = () => {
  return (
    <PageContainer>
      <ContentWrapper>
        <LogoImage src={logoLendas} alt="Logo Lendas" />
        <ButtonContainer>
          <Link to="/ligas">
            <Button>Ligas</Button>
          </Link>
          <Link to="/estatisticas">
            <Button>Estatísticas</Button>
          </Link>
        </ButtonContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default HomePage;
