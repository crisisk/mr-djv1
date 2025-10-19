// layouts/MainLayout.jsx or similar
import StickyBookingCTA from '../components/StickyBookingCTA';

const MainLayout = ({ children }) => {
  return (
    <>
      {children}
      <StickyBookingCTA />
    </>
  );
};