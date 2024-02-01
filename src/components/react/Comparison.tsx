// src/components/ExpandableLists.js
import { useState } from "react";
import StatsCard from "./StatsCard"
import { $predictOutputComplete } from "../../store/PredictOutputStore";
import { $isOpenStatsContainer } from "../../store/StatsStore";
import type { PredictOutput } from "../../types/PredictOutput";

const Comparison = () => {

  const [IsStatsOpen, setStatsOpen] = useState(false);
  $isOpenStatsContainer.listen((value)=>setStatsOpen(value))
  const [segment1, setSegment1] = useState<PredictOutput>()
  const [segment2, setSegment2] = useState<PredictOutput>()
  const [segment3, setSegment3] = useState<PredictOutput>()
  $predictOutputComplete.listen((value)=> {
    setSegment1(value.segment1)
    setSegment2(value.segment2)
    setSegment3(value.segment3)
  })
  return (
    <div className={`max-w-screen-lg mx-auto bg-gray-200 rounded-lg  transition-all duration-300 ${(!IsStatsOpen) ? "opacity-0 max-h-0 overflow-hidden m-0 p-0" : "opacity-100 max-h-96 mt-8 p-4"}`}>
      <div className="flex flex-row space-x-4 items-center justify-center">
        <h4 className="text-2xl text-gray-800 mb-2">Accidentabilidad</h4>
      </div>
      <div className="flex flex-row space-x-4 items-center justify-center">
        <StatsCard
          title="Tramo 1"
          iconText=" A-B "
          color="#F34E2A"
          distance={segment1?.distance ?? 0}
          probability={segment1?.probability ?? 0}
          restDays={segment1?.restdays ?? 0}
          severity={segment1?.severity ?? 0}
        />

        <StatsCard
          title="Tramo 2"
          color="#2A5BF3"
          iconText=" B-C "
          distance={segment2?.distance ?? 0}
          probability={segment2?.probability ?? 0}
          restDays={segment2?.restdays ?? 0}
          severity={segment2?.severity ?? 0}
        />

        <StatsCard
          title="Tramo 3"
          color="#C52AF3"
          iconText=" C-D "
          distance={segment3?.distance ?? 0}
          probability={segment3?.probability ?? 0}
          restDays={segment3?.restdays ?? 0}
          severity={segment3?.severity ?? 0}
        />
      </div>
      
    </div>
  );
};

export default Comparison;
