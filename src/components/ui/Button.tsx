import React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}

// React component props interface
interface ReactButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  as?: any;
  href?: string;
  to?: string;
  target?: string;
  rel?: string;
}

const getButtonStyles = (variant: ButtonVariant = 'primary', theme: any) => {
  switch (variant) {    case 'primary':
      return css`
        background: ${theme.colors.gradients.primary};
        color: #000000;
        border: none;
        font-weight: ${theme.fontWeights.bold};
        
        &:hover {
          box-shadow: 0 0 20px ${theme.colors.primary}90;
          transform: translateY(-2px);
        }
      `;
    case 'secondary':
      return css`
        background: ${theme.colors.gradients.secondary};
        color: #FFFFFF;
        border: none;
        font-weight: ${theme.fontWeights.bold};
        
        &:hover {
          box-shadow: 0 0 20px ${theme.colors.secondary}90;
          transform: translateY(-2px);
        }
      `;
    case 'outline':
      return css`
        background: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        
        &:hover {
          background: ${theme.colors.primary}20;
          box-shadow: 0 0 15px ${theme.colors.primary}70;
        }
      `;
    case 'text':
      return css`
        background: transparent;
        color: ${theme.colors.text.primary};
        border: none;
        padding: 0;
        
        &:hover {
          color: ${theme.colors.accent};
          transform: translateY(0);
        }
      `;
    default:
      return '';
  }
};

const getButtonSize = (size: ButtonSize = 'medium', theme: any) => {
  switch (size) {
    case 'small':
      return css`
        padding: ${theme.spacing.xs} ${theme.spacing.md};
        font-size: ${theme.fontSizes.sm};
      `;
    case 'medium':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.lg};
        font-size: ${theme.fontSizes.base};
      `;
    case 'large':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: ${theme.fontSizes.lg};
      `;
    default:
      return '';
  }
};

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.animations.normal} ease;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  ${({ $variant, theme }) => getButtonStyles($variant, theme)}
  ${({ $size, theme }) => getButtonSize($size, theme)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0) !important;
    box-shadow: none !important;
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

export const IconButton = styled(Button)`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 0;
  
  svg {
    margin-right: 0;
  }
`;

// React Button component wrapper
export const ButtonComponent: React.FC<ReactButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <Button
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </Button>
  );
};

// For backward compatibility, re-export as Button
export { Button };
export default ButtonComponent;
