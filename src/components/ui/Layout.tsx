import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 0;
  }
`;

export const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradients.primary};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

export const SectionSubtitle = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 3}, 1fr);
  gap: ${({ gap, theme }) => gap || theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div<{ 
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  align-items: ${({ align }) => align || 'center'};
  gap: ${({ gap, theme }) => gap || theme.spacing.md};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
`;

export const GlowBackground = styled.div`
  position: absolute;
  width: 40%;
  height: 40%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  filter: blur(150px);
  opacity: 0.15;
  z-index: -1;
`;

export const Divider = styled.hr<{ vertical?: boolean }>`
  border: none;
  ${({ vertical }) =>
    vertical
      ? `
    width: 1px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent,
      ${({ theme }: any) => theme.colors.primary}50,
      transparent
    );
    margin: 0 ${({ theme }: any) => theme.spacing.md};
  `
      : `
    height: 1px;
    background: linear-gradient(
      to right,
      transparent,
      ${({ theme }: any) => theme.colors.primary}50,
      transparent
    );
    margin: ${({ theme }: any) => theme.spacing.lg} 0;
  `}
`;
