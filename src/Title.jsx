import React from 'react';

const Title = ({ hexArray }) => {
  return (
    <div className='title'>
      <h1 style={{ display: 'flex', alignItems: 'center' }}>
        HEX<span className='hex-text' style={{ color: `#${hexArray[0].hexString}` }}>
          <svg
            fill="currentColor"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 184.751 184.751"
            style={{ height: "9.75vw", margin: 'auto' }} // Add this line to center the SVG vertically
          >
            <path d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z" />
          </svg>
        </span>
      </h1>
      <span className='sub-title'>⁄⁄color trainer</span>
    </div>
  );
};

export default Title;
