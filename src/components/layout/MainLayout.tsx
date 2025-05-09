import React from 'react';
import { AppShell, Container } from '@mantine/core';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      
      <AppShell.Main>
        <Container size="xl" py="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;