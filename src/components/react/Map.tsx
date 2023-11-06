import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '40em',
};

const center = {
  lat: -33.4489, // Santiago de Chile latitude
  lng: -70.6693, // Santiago de Chile longitude
};

const Map = () => {
  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg">
      <LoadScript
        googleMapsApiKey=""
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        />
      </LoadScript>
    </div>
  );
};

export default Map;
