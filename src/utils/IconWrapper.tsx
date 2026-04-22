import React from 'react';
import { IconType } from 'react-icons';
import { IconContext } from 'react-icons';

// This wrapper component fixes the TypeScript error with react-icons
// Error: TS2786: '[IconName]' cannot be used as a JSX component
export interface IconWrapperProps extends React.SVGAttributes<SVGElement> {
  icon: IconType;
  size?: number | string;
  color?: string;
  title?: string;
}

export const IconWrapper = ({ icon: Icon, size, color, ...props }: IconWrapperProps) => {
  return (
    <IconContext.Provider value={{ size: size?.toString(), color }}>
      {/* @ts-ignore - TypeScript cannot recognize the icon component correctly */}
      <Icon {...props} />
    </IconContext.Provider>
  );
};
