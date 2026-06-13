import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', position: 'relative', background: 'var(--bg-primary)' }}>
      <Header />
      
      <main 
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'transparent'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
