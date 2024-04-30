import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { $predictInput } from '../../store/PrecitInputStore';
import { $predictOutputComplete, type PredictCompleteOutput } from '../../store/PredictOutputStore';
import { $isOpenStatsContainer } from '../../store/StatsStore';
import type { PredictInput } from '../../types/PredictInput';
import { PredictService } from '../../services/PredictService';
import type { PredictOutput } from '../../types/PredictOutput';
import { StaticService } from '../../services/StaticService';
import { $probability } from '../../store/Probability';

const containerStyle = {
  width: '100%',
  height: '40em',
};

const zoom = 15;

let mapRef: google.maps.Map | null = null;

const Map = () => {
  const predictService = new PredictService()
  const staticService = new StaticService()
  const [directions, setDirections] = useState<google.maps.DirectionsResult | undefined>(undefined);
  const [center, setCenter] = useState({ lat: -33.4489, lng: -70.6693 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [toPredict, setToPredict] = useState<PredictInput>();

  $predictInput.listen((r) => {
    setToPredict(r)
  })

  const setPredictOuput = (output: PredictOutput[]) => {
    $predictOutputComplete.set({
      segment1: output[0],
      segment2: output[1],
      segment3: output[2],
    })
  }

  const setStatsOpenContainer = (value: boolean) => {
    $isOpenStatsContainer.set(value)
  }

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === "OK") {
        setDirections(response);
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
    if (toPredict?.origin && toPredict?.destination) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: toPredict.origin,
          destination: toPredict.destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        directionsCallback
      );
    }
  }, [toPredict, mapLoaded]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef = map;
    setMapLoaded(true);
  };

  const renderSegment = (id: string,startIdx: number, endIdx: number, color: string, originLabel: string, destinationLabel: string) => {
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

    return {
      component: <>
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
        <Marker position={startLocation} label={originLabel} />
        <Marker position={endLocation} label={destinationLabel} />
      </>,
      leg: dummyLeg 
    };
  };

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getCommuneName(address: string): string {
    let commune = address.split(",")[1].trim()
    return commune.trim() 
  }

  async function getProbability(origin: string, destination: string){
    const originComune = getCommuneName(origin)
    const destinationComune = getCommuneName(destination)
    const vehicle_type = toPredict?.vehicle_type || "";
    const age = toPredict?.age || 0;
    const gender = toPredict?.gender || "";
    const probaility = await staticService.request(
      originComune,
      destinationComune,
      vehicle_type,
      age,
      gender
    )
    $probability.set(probaility)
  }
  
  function buildSegments(){
    if(!directions){
      return (<></>)
    } else {
      getProbability(directions.routes[0].legs[0].start_address, directions.routes[0].legs[0].end_address)
      const segment1 = renderSegment("distance1", 0, Math.ceil(directions.routes[0].legs.flatMap((leg) => leg.steps).length / 3), "#F34E2A", "A", "B")
      const segment2 = renderSegment(
        "distance2",
        Math.ceil(directions.routes[0].legs.flatMap((leg) => leg.steps).length / 3),
        Math.ceil((2 * directions.routes[0].legs.flatMap((leg) => leg.steps).length) / 3),
        "#2A5BF3", "B", "C"
      )
      const segment3 = renderSegment(
        "distance3",
        Math.ceil((2 * directions.routes[0].legs.flatMap((leg) => leg.steps).length) / 3),
        directions.routes[0].legs.flatMap((leg) => leg.steps).length,
        "#46183d", "C", "D"
      )
      
      const predictInput: PredictInput[] = [
        {
          age: toPredict?.age || 0,
          gender: toPredict?.gender || "",
          destination: segment1?.leg.end_location.toString() || "",
          origin: segment1?.leg?.start_location.toString() || "",
          timestamp: toPredict?.timestamp || "",
          vehicle_type: toPredict?.vehicle_type || "",
        },
        {
          age: toPredict?.age || 0,
          gender: toPredict?.gender || "",
          destination: segment2?.leg.end_location.toString() || "",
          origin: segment2?.leg?.start_location.toString() || "",
          timestamp: toPredict?.timestamp || "",
          vehicle_type: toPredict?.vehicle_type || "",
        },
        {
          age: toPredict?.age || 0,
          gender: toPredict?.gender || "",
          destination: segment3?.leg.end_location.toString() || "",
          origin: segment3?.leg?.start_location.toString() || "",
          timestamp: toPredict?.timestamp || "",
          vehicle_type: toPredict?.vehicle_type || "",
        }
      ];
      const distances: number[] = [
        segment1?.leg?.distance?.value ?? 0,
        segment2?.leg?.distance?.value ?? 0, 
        segment3?.leg?.distance?.value ?? 0
      ]
      predict(predictInput, distances)

      return (
        <>
          {segment1?.component}
          {segment2?.component}
          {segment3?.component}
        </>
      )
    }
  }

  function predict(input: PredictInput[], distances: number[]){
    predictService.predict(input).then((result: any[]) => {
      const buildedOutput: PredictOutput[] = []
      result.forEach((item, index) => {
        buildedOutput.push({
          id: item.id,
          probability: item.probability,
          restdays: item.restdays,
          severity: item.severity,
          type: item.type,
          distance: distances[index]
        })
      })
      setPredictOuput(buildedOutput)
      setStatsOpenContainer(true)
    }).catch((err) => console.error(err))
  }

  

  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom} onLoad={handleMapLoad}>
        {mapLoaded &&
          directions && (
            <>
            {buildSegments()}
            </>
          )}
      </GoogleMap>
    </div>
  );
};

export default Map;
