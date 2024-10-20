import React from 'react';

const Sidebar = ({ pins, setCenter, clearPins }) => {
  return (
    <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Saved Pins</h2>
      {pins.length > 0 ? (
        pins.map((pin, index) => (
          <div key={index} className="mb-4 p-2 bg-white rounded shadow">
            <h3 className="font-bold">{pin.remark}</h3>
            <p className="text-sm">{pin.address}</p>
            <p className="text-xs text-gray-500">
              {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
            </p>
            <button
              onClick={() => setCenter({ lat: pin.lat, lng: pin.lng })}
              className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Center Map
            </button>
          </div>
        ))
      ) : (
        <p>No pins saved yet.</p>
      )}
      <button
        onClick={clearPins}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Clear All Pins
      </button>
    </div>
  );
};

export default Sidebar;




