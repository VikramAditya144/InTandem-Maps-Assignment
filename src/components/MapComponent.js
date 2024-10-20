import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG pin icon
const pinIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
    <path fill="#FF4136" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
  </svg>
`;

// Create a custom icon
const customIcon = new L.DivIcon({
  className: 'custom-pin-icon',
  html: pinIcon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const MapEvents = ({ addTempPin }) => {
  useMapEvents({
    click(e) {
      addTempPin(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent = ({ pins, tempPin, center, addTempPin, saveTempPin, removeTempPin }) => {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pins.map((pin, index) => (
        <Marker key={index} position={[pin.lat, pin.lng]} icon={customIcon}>
          <Popup>
            <h3>{pin.remark}</h3>
            <p>{pin.address}</p>
          </Popup>
        </Marker>
      ))}
      {tempPin && (
        <Marker position={[tempPin.lat, tempPin.lng]} icon={customIcon}>
          <Popup>
            <form onSubmit={(e) => {
              e.preventDefault();
              saveTempPin(e.target.remark.value);
            }}>
              <input type="text" name="remark" placeholder="Enter remark" />
              <button type="submit">Save Pin</button>
              <button type="button" onClick={removeTempPin}>Cancel</button>
            </form>
          </Popup>
        </Marker>
      )}
      <MapEvents addTempPin={addTempPin} />
    </MapContainer>
  );
};

export default MapComponent;