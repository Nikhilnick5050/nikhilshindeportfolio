import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  transparentHeader?: boolean;
}

const Main = styled.main`
  min-height: 100vh;
  padding-top: 80px; // Height of navbar
`;

const Layout: React.FC<LayoutProps> = ({ children, transparentHeader }) => {
  return (
    <>
      <Navbar transparent={transparentHeader} />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout;
