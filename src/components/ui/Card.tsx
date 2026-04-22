import styled from 'styled-components';

interface CardProps {
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  position: relative;
  transition: transform ${({ theme }) => theme.animations.normal} ease,
              box-shadow ${({ theme }) => theme.animations.normal} ease;
  
  ${({ variant, theme }) => 
    variant === 'elevated' && `
      box-shadow: ${theme.shadows.lg};
    `
  }
  
  ${({ variant, theme }) =>
    variant === 'bordered' && `
      border: 1px solid ${theme.colors.primary}30;
    `
  }
  
  ${({ hoverable }) =>
    hoverable && `
      cursor: pointer;
      
      &:hover {
        transform: translateY(-8px);
      }
    `
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform ${({ theme }) => theme.animations.normal} ease;
  }
  
  ${({ hoverable }) =>
    hoverable && `
      &:hover::after {
        transform: scaleX(1);
      }
    `
  }
`;

export const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
`;

export const CardBody = styled.div``;

export const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const CardTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CardSubtitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export default Card;
