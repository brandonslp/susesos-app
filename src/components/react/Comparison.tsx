// src/components/ExpandableLists.js
import { useState } from "react";
import StatsCard from "./StatsCard"
import { $travelStats } from "../../store/TravelStats";
import { $isOpenStatsContainer } from "../../store/StatsStore";

const Comparison = () => {

  const [IsStatsOpen, setStatsOpen] = useState(false);
  $isOpenStatsContainer.listen((value)=>setStatsOpen(value))
  const [distance1, setDistance1] = useState(0)
  const [distance2, setDistance2] = useState(0)
  const [distance3, setDistance3] = useState(0)
  $travelStats.listen((value)=> {
    setDistance1(value.distance1)
    setDistance2(value.distance2)
    setDistance3(value.distance3)
  })
  return (
    <div className={`max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg flex flex-row space-x-4 items-center justify-center  transition ${(!IsStatsOpen) ? "hidden" : ""}`}>

      <StatsCard 
        title="Tramo 1"
        iconText=" A-B "
        color="#F34E2A"
        distance={distance1}
        probability={1}
        restDays={6}
        severity={1}
        type="low"
      />
      
      <StatsCard
        title="Tramo 2"
        color="#2A5BF3"
        iconText=" B-C "
        distance={distance2}
        probability={1}
        restDays={6}
        severity={1}
        type="low"
      />

      <StatsCard
        title="Tramo 3"
        color="#C52AF3"
        iconText=" C-D "
        distance={distance3}
        probability={1}
        restDays={6}
        severity={1}
        type="low"
      />
      

    </div>
  );
};

export default Comparison;
