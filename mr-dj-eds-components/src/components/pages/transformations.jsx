// pages/transformations.jsx

import BeforeAfterSlider from '../components/BeforeAfterSlider';

const TransformationsPage = () => {
  return (
    <div className="transformations-container">
      <h2>Event Transformations</h2>
      <BeforeAfterSlider
        beforeImage="/images/venue-before.jpg"
        afterImage="/images/venue-after.jpg"
        alt="Venue Transformation"
      />
      {/* Add more sliders as needed */}
    </div>
  );
};