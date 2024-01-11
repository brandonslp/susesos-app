import { DirectionsRenderer, GoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { $route } from '../../store/RouteStore';

const containerStyle = {
  width: '100%',
  height: '40em',
};

const zoom = 15;

let mapRef: google.maps.Map | null = null;

const Map = () => {

  const [directions, setDirections] = useState<google.maps.DirectionsResult | undefined>(undefined);
  const [center, setCenter] = useState({ lat: -33.4489, lng: -70.6693 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [route, setRoute] = useState<Route>({ origin: "", destination: "" });

  $route.listen((r) => {
    setRoute({origin: r.origin, destination: r.destination})
  })

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === "OK") {
        // Dibujar la ruta en el mapa
        setDirections(response);
        if (response.routes && response.routes[0] && response.routes[0].legs) {
          const firstLeg = response.routes[0].legs[0];
          if (firstLeg && firstLeg.start_location) {
            setCenter({
              lat: firstLeg.start_location.lat(),
              lng: firstLeg.start_location.lng(),
            });
          }
        }
      } else {
        console.error('Error al obtener direcciones:', response.status);
      }
    }
  };

  useEffect(() => {
    if (route.origin && route.destination) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: route.origin,
          destination: route.destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        directionsCallback
      );
    }
  }, [route, mapLoaded]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef = map;
    setMapLoaded(true);
  };


  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={handleMapLoad}
      >
        {mapLoaded && directions && <DirectionsRenderer directions={directions} />}

      </GoogleMap>
    </div>
  );
};

export default Map;
