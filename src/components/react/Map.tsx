import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { $route } from '../../store/RouteStore';
import { $travelStats, type TravelStats } from '../../store/TravelStats';
import { $isOpenStatsContainer } from '../../store/StatsStore';

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

  const setDistance = (key: keyof TravelStats, value: number) => {
    $travelStats.setKey(key, value)
  }

  const setStatsOpenContainer = (value: boolean) => {
    $isOpenStatsContainer.set(value)
  }

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
        setStatsOpenContainer(true)
        if (response.routes && response.routes[0] && response.routes[0].legs) {
          const route = response.routes[0]
          const firstLeg = route.legs[0];
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

  const renderSegment = (id: keyof TravelStats,startIdx: number, endIdx: number, color: string, originLabel: string, destinationLabel: string) => {
    if (!directions || !directions.routes || !directions.routes[0] || !directions.routes[0].legs) {
      return null;
    }

    const route = directions.routes[0];
    const steps = route.legs.flatMap((leg) => leg.steps);
    const segmentSteps = steps.slice(startIdx, endIdx);

    const segmentDistance = (segmentSteps.reduce((acc, step) => acc + (step?.distance?.value ?? 0), 0) / 1000);
    const segmentDuration = segmentSteps.reduce((acc, step) => acc + (step?.duration?.value ?? 0), 0);

    
    const startLocation = segmentSteps.length > 0 ? segmentSteps[0].start_location : { lat: 0, lng: 0 };
    const endLocation = segmentSteps.length > 0 ? segmentSteps[segmentSteps.length - 1].end_location : { lat: 0, lng: 0 };

    setDistance(id, segmentDistance)
    
    const distanceObj: google.maps.Distance = {
      text: `${segmentDistance} km`,
      value: segmentDistance,
    };

    const durationObj: google.maps.Duration = {
      text: `${Math.floor(segmentDuration / 60)} mins`,
      value: segmentDuration,
    };

    
    const dummyLeg: google.maps.DirectionsLeg = {
      end_address: '',
      end_location: endLocation as google.maps.LatLng,
      start_address: '',
      start_location: startLocation as google.maps.LatLng,
      duration: durationObj,
      distance: distanceObj,
      steps: segmentSteps,
      traffic_speed_entry: [],
      via_waypoints: [],
    };

    return (
      <>
        <DirectionsRenderer
          options={{
            polylineOptions: {
              strokeColor: color ?? getRandomColor(),
            },
            markerOptions: {
              visible: false
            },
          }}
          directions={{
            ...directions,
            routes: [
              {
                ...route,
                legs: [dummyLeg],
              },
            ],
          }}
        />
        <Marker position={startLocation} label={originLabel}/>
        <Marker position={endLocation} label={destinationLabel} />
      </>
    );
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={handleMapLoad}>
        {mapLoaded &&
          directions && (
            <>
            {renderSegment("distance1", 0, Math.ceil(directions.routes[0].legs.flatMap((leg) => leg.steps).length / 3), "#F34E2A", "A", "B")}
              {renderSegment(
                "distance2",
                Math.ceil(directions.routes[0].legs.flatMap((leg) => leg.steps).length / 3),
                Math.ceil((2 * directions.routes[0].legs.flatMap((leg) => leg.steps).length) / 3),
                "#2A5BF3", "B", "C"
              )}
              {renderSegment(
                "distance3",
                Math.ceil((2 * directions.routes[0].legs.flatMap((leg) => leg.steps).length) / 3),
                directions.routes[0].legs.flatMap((leg) => leg.steps).length,
                "#C52AF3", "C", "D"
              )}
            </>
          )}
      </GoogleMap>
    </div>
  );
};

export default Map;
