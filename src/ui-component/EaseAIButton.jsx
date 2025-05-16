import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const FloatingButton = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 99;

  &:hover {
    transform: scale(1.1);
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
`;

const EaseAIButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGlobalButtonClick = () => {
    navigate('/easeai-chatbot', { state: { from: location.pathname } });
  };

  return (
    <FloatingButton onClick={handleGlobalButtonClick}>
      <Logo src="/src/assets/images/easeworkai_logo.jpeg" alt="EaseWorkAI Logo" />
    </FloatingButton>
  );
};

export default EaseAIButton;