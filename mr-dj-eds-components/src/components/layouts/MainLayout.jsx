// layouts/MainLayout.jsx or similar
import React from 'react';
import Header from '../Molecules/Header.jsx';
import Footer from '../Organisms/Footer.jsx';

/**
 * Primary marketing layout that combines the shared header and footer. The
 * layout keeps the main slot flexible so that feature pages can provide their
 * own container classes without duplicating the chrome wiring.
 */
const MainLayout = ({ children, headerTransparent = false, mainClassName = 'flex-1' }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header transparent={headerTransparent} />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
