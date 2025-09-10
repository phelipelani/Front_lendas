import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { createLiga } from "../../services/api";
import Button from "../common/Button";
import { useToast } from "../../contexts/ToastContext"; // <-- Importe o hook

// ... (keyframes e styled-components continuam os mesmos)
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;
const slideIn = keyframes`from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`;
const slideOut = keyframes`from { transform: translateY(0); opacity: 1; } to { transform: translateY(-30px); opacity: 0; }`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${(props) => (props.isClosing ? fadeOut : fadeIn)} 0.3s forwards;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #0a192f;
  background-image: url("https://www.transparenttextures.com/patterns/dark-denim-3.png");
  padding: clamp(20px, 5vw, 30px) clamp(25px, 6vw, 40px);
  border-radius: 12px;
  border: 1px solid #facc15;
  width: 90%;
  max-width: 450px;
  min-width: 280px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${(props) => (props.isClosing ? slideOut : slideIn)} 0.3s forwards;

  /* Melhor responsividade para telas pequenas */
  @media (max-width: 480px) {
    width: 95%;
    padding: 20px 25px;
    max-height: 85vh;
  }

  @media (max-height: 600px) {
    padding: 15px 20px;
    max-height: 80vh;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #facc15;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const ModalTitle = styled.h2`
  color: #facc15;
  text-align: center;
  margin-bottom: clamp(20px, 4vw, 25px);
  font-size: clamp(1.25rem, 4vw, 1.5rem);
`;

const FormGroup = styled.div`
  margin-bottom: clamp(15px, 3vw, 20px);
`;

const Label = styled.label`
  display: block;
  color: #e6f1ff;
  margin-bottom: clamp(6px, 2vw, 8px);
  font-weight: bold;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
`;

const Input = styled.input`
  width: 100%;
  padding: clamp(10px, 2.5vw, 12px);
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  color: #0a192f;
  box-sizing: border-box;
`;

const ConfirmButton = styled(Button)`
  background-color: #10b981;
  width: 100%;
  margin-top: 10px;
  &:hover {
    background-color: #34d399;
  }
`;

const CriarLigaModal = ({ isOpen, onClose, onSuccess }) => {
  const [nome, setNome] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const { showToast } = useToast(); // <-- Use o hook

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data_inicio = new Date().toISOString().split("T")[0];
    try {
      await createLiga({ nome, data_inicio, data_fim: dataFim });
      showToast("Liga criada com sucesso!", "success");
      onSuccess();
      handleClose();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose} isClosing={isClosing}>
      <ModalContent onClick={(e) => e.stopPropagation()} isClosing={isClosing}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <ModalTitle>Criar Liga</ModalTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="nome-liga">Nome Liga</Label>
            <Input
              id="nome-liga"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="data-termino">Data Término</Label>
            <Input
              id="data-termino"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </FormGroup>
          <ConfirmButton type="submit">Confirmar</ConfirmButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CriarLigaModal;
