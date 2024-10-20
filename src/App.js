import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';
import { getAddress } from './utils/api';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: #121212;
    color: #e0e0e0;
  }
`;

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
`;

const SidebarContainer = styled(motion.div)`
  width: 30%;
  padding: 2rem;
  background-color: rgba(30, 30, 30, 0.8);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  border-right: 1px solid #333;
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: bold;
  padding: 1.5rem;
  text-align: center;
  color: #f0f0f0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background-color: rgba(30, 30, 30, 0.8);
  margin: 0;
`;

const MapWrapper = styled(motion.div)`
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  margin: 1rem;
  border: 1px solid #444;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #2980b9;
  }
`;

const PinCard = styled(motion.div)`
  background-color: rgba(40, 40, 40, 0.8);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PopupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PopupInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #333;
  color: #f0f0f0;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const PopupButton = styled.button`
  padding: 0.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
  font-weight: 600;

  &:hover {
    background-color: #2980b9;
  }
`;

// Custom SVG pin icon
const pinIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
    <path fill="#2980b9" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
  </svg>
`;

// Create custom icons
const customIcon = new L.DivIcon({
  className: 'custom-pin-icon',
  html: pinIcon,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const highlightedIcon = new L.DivIcon({
  className: 'custom-pin-icon highlighted',
  html: pinIcon.replace('#2980b9', '#f39c12'),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const MapEvents = ({ addTempPin }) => {
  useMapEvents({
    click(e) {
      addTempPin(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapComponent = ({ pins, tempPin, center, addTempPin, saveTempPin, removeTempPin, highlightedPinId }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, 13);
    }
  }, [center]);

  return (
    <MapWrapper
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pins.map((pin, index) => (
          <Marker 
            key={index} 
            position={[pin.lat, pin.lng]} 
            icon={index === highlightedPinId ? highlightedIcon : customIcon}
          >
            <Popup>
              <h3>{pin.remark}</h3>
              <p>{pin.address}</p>
            </Popup>
          </Marker>
        ))}
        {tempPin && (
          <Marker position={[tempPin.lat, tempPin.lng]} icon={customIcon}>
            <Popup>
              <PopupForm onSubmit={(e) => {
                e.preventDefault();
                saveTempPin(e.target.remark.value);
              }}>
                <PopupInput type="text" name="remark" placeholder="remark" />
                <PopupButton type="submit">Save Pin</PopupButton>
                <PopupButton type="button" onClick={removeTempPin}>Cancel</PopupButton>
              </PopupForm>
            </Popup>
          </Marker>
        )}
        <MapEvents addTempPin={addTempPin} />
      </MapContainer>
    </MapWrapper>
  );
};

const Sidebar = ({ pins, setCenter, clearPins, setHighlightedPinId }) => {
  return (
    <SidebarContainer
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Saved Pins
      </motion.h2>
      <AnimatePresence>
        {pins.length > 0 ? (
          pins.map((pin, index) => (
            <PinCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-bold mb-2">{pin.remark}</h3>
              <p className="text-sm mb-2">{pin.address}</p>
              <p className="text-xs text-gray-400 mb-3">
                {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
              </p>
              <Button
                onClick={() => {
                  setCenter({ lat: pin.lat, lng: pin.lng });
                  setHighlightedPinId(index);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Center Map
              </Button>
            </PinCard>
          ))
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            No pins saved yet.
          </motion.p>
        )}
      </AnimatePresence>
      <Button
        onClick={clearPins}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ backgroundColor: '#e74c3c', marginTop: '2rem' }}
      >
        Clear All Pins
      </Button>
    </SidebarContainer>
  );
};

const App = () => {
  const [pins, setPins] = useState([]);
  const [tempPin, setTempPin] = useState(null);
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 });
  const [highlightedPinId, setHighlightedPinId] = useState(null);

  useEffect(() => {
    const savedPins = localStorage.getItem('pins');
    if (savedPins) {
      setPins(JSON.parse(savedPins));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pins', JSON.stringify(pins));
  }, [pins]);

  const addTempPin = (lat, lng) => {
    console.log('Adding temp pin:', lat, lng);
    setTempPin({ lat, lng });
  };

  const saveTempPin = async (remark) => {
    if (tempPin) {
      const address = await getAddress(tempPin.lat, tempPin.lng);
      const newPin = { ...tempPin, remark, address };
      setPins([...pins, newPin]);
      setTempPin(null);
    }
  };

  const removeTempPin = () => {
    setTempPin(null);
  };

  const clearPins = () => {
    setPins([]);
    setHighlightedPinId(null);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Sidebar 
          pins={pins} 
          setCenter={setCenter} 
          clearPins={clearPins} 
          setHighlightedPinId={setHighlightedPinId}
        />
        <MainContent>
          <Title
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            InTandem Maps
          </Title>
          <MapComponent
            pins={pins}
            tempPin={tempPin}
            center={center}
            addTempPin={addTempPin}
            saveTempPin={saveTempPin}
            removeTempPin={removeTempPin}
            highlightedPinId={highlightedPinId}
          />
        </MainContent>
      </AppContainer>
    </>
  );
};

export default App;