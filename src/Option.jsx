import React from 'react';

const Option = ({ label, checked, onChange }) => {
  return (
    <div className='option'>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
      </label>
      <span className='option-label'>{label}</span>
    </div>
  );
};

export default Option;