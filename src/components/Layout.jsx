import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
