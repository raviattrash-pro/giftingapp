import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useUiStore } from '../../store/uiStore';

const MainLayout = () => {
  const { designStyle } = useUiStore();
  const isSpatial = designStyle === 'spatial';

  return (
    <div 
      className={isSpatial ? 'spatial-layout-wrapper' : ''}
      style={!isSpatial ? { display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', overflowX: 'hidden', position: 'relative' } : {}}
    >
      <Header />
      
      <main 
        className={isSpatial ? 'spatial-main-window' : ''}
        style={!isSpatial ? {
          flex: 1,
          background: 'transparent'
        } : {}}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
