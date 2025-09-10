import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/common/Button";
import BackButton from "../components/common/BackButton";
import { getLigas } from "../services/api";
import CriarLigaModal from "../components/ligas/CriarLigaModal";

const LigaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(15px, 4vw, 20px);
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (orientation: landscape) and (max-height: 600px) {
    gap: 15px;
  }
`;

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 450px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: clamp(15px, 4vw, 20px);
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  @media (orientation: landscape) and (max-height: 600px) {
    padding: 15px;
    max-width: 500px;
  }
`;

const CarouselWrapper = styled.div`
  overflow: hidden;
  border-radius: 6px;
`;

const CarouselTrack = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${props => props.translateX}px);
`;

const CarouselSlide = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LigaItem = styled(Link)`
  background-color: #0a192f;
  color: #facc15;
  padding: clamp(10px, 3vw, 12px) clamp(16px, 4vw, 20px);
  border-radius: 6px;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  word-break: break-word;

  &:hover {
    background-color: #172a45;
    transform: scale(1.02);
  }

  @media (orientation: landscape) and (max-height: 600px) {
    padding: 10px 16px;
  }
`;

const CarouselControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  gap: 10px;
`;

const CarouselButton = styled.button`
  background-color: #0a192f;
  color: #facc15;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-size: clamp(0.75rem, 2vw, 0.875rem);

  &:hover:not(:disabled) {
    background-color: #172a45;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CarouselIndicators = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const CarouselDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#0a192f' : '#ccc'};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0a192f;
  }
`;

const CarouselInfo = styled.div`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #0a192f;
  font-weight: bold;
`;

const LoadingMessage = styled.p`
  color: #0a192f;
  text-align: center;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  margin: 20px 0;
`;

const EmptyMessage = styled.p`
  color: #0a192f;
  text-align: center;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  margin: 20px 0;
`;

const LigasPage = () => {
  const [ligas, setLigas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  // Configuração do carrossel - quantas ligas por slide
  const ligasPerSlide = 3;
  const totalSlides = Math.ceil(ligas.length / ligasPerSlide);

  const fetchLigas = async () => {
    setLoading(true);
    const data = await getLigas();
    
    // Ordenar ligas pela data de criação (mais recente primeiro)
    const sortedLigas = data.sort((a, b) => {
      const dateA = new Date(a.dataCriacao || a.created_at || 0);
      const dateB = new Date(b.dataCriacao || b.created_at || 0);
      return dateB - dateA;
    });
    
    setLigas(sortedLigas);
    setLoading(false);
  };

  useEffect(() => {
    fetchLigas();
  }, []);

  const handleLigaCriada = () => {
    setIsModalOpen(false);
    fetchLigas();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const getSlideWidth = () => {
    return carouselRef.current ? carouselRef.current.offsetWidth : 0;
  };

  const translateX = -currentSlide * getSlideWidth();

  // Dividir ligas em slides
  const slides = [];
  for (let i = 0; i < ligas.length; i += ligasPerSlide) {
    slides.push(ligas.slice(i, i + ligasPerSlide));
  }

  return (
    <>
      <LigaContainer>
        <Button onClick={() => setIsModalOpen(true)}>Criar Liga +</Button>
        
        <CarouselContainer>
          {loading ? (
            <LoadingMessage>Carregando ligas...</LoadingMessage>
          ) : ligas.length > 0 ? (
            <>
              <CarouselWrapper ref={carouselRef}>
                <CarouselTrack translateX={translateX}>
                  {slides.map((slide, slideIndex) => (
                    <CarouselSlide key={slideIndex}>
                      {slide.map((liga) => (
                        <LigaItem key={liga.id} to={`/liga/${liga.id}`}>
                          {liga.nome}
                        </LigaItem>
                      ))}
                    </CarouselSlide>
                  ))}
                </CarouselTrack>
              </CarouselWrapper>
              
              {totalSlides > 1 && (
                <CarouselControls>
                  <CarouselButton 
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                  >
                    ← Anterior
                  </CarouselButton>
                  
                  <CarouselIndicators>
                    <CarouselInfo>
                      {currentSlide + 1} de {totalSlides}
                    </CarouselInfo>
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <CarouselDot
                        key={index}
                        active={index === currentSlide}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </CarouselIndicators>
                  
                  <CarouselButton 
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                  >
                    Próximo →
                  </CarouselButton>
                </CarouselControls>
              )}
            </>
          ) : (
            <EmptyMessage>Nenhuma liga ativa encontrada.</EmptyMessage>
          )}
        </CarouselContainer>
        
        <BackButton />
      </LigaContainer>

      <CriarLigaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLigaCriada}
      />
    </>
  );
};

export default LigasPage;
