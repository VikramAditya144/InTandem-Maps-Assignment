import React, { useState, useEffect } from 'react';

const PinForm = ({ addPin, center }) => {
  const [latitude, setLatitude] = useState(center.lat);
  const [longitude, setLongitude] = useState(center.lng);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    setLatitude(center.lat);
    setLongitude(center.lng);
  }, [center]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPin(latitude, longitude, remark);
    setRemark('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100">
      <div className="flex mb-4">
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
          placeholder="Latitude"
          step="0.000001"
          className="w-1/2 p-2 mr-2 rounded"
        />
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          placeholder="Longitude"
          step="0.000001"
          className="w-1/2 p-2 rounded"
        />
      </div>
      <input
        type="text"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Remark"
        className="w-full p-2 mb-4 rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        Add Pin
      </button>
    </form>
  );
};

export default PinForm;

