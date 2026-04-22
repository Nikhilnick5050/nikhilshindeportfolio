import React from 'react';
import styled from 'styled-components';
import { usePortfolio } from '../context/PortfolioContext';
import { IconWrapper } from '../utils/IconWrapper';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const StatusBar = styled.div<{ $connected: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;  background: ${({ $connected }) => 
    $connected ? '#28a745' : '#ffc107'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
`;

const AdminConnectionStatus: React.FC = () => {
  const { error, refreshData } = usePortfolio();
  
  const isConnected = !error || !error.includes('static data');  return (
    <StatusBar $connected={isConnected} onClick={refreshData}>
      {isConnected ? (
        <>
          <IconWrapper icon={FaCheckCircle} />
          
        </>
      ) : (
        <>
          <IconWrapper icon={FaExclamationTriangle} />
          
        </>
      )}
    </StatusBar>
  );
};

export default AdminConnectionStatus;
