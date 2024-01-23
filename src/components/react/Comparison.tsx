// src/components/ExpandableLists.js
import { useState } from "react";
import List from "./List";
import { $travelStats } from "../../store/TravelStats";

const Comparison = () => {

  const list1Items = ['Item 1', 'Item 2', 'Item 3'];
  const list2Items = ['Item 1', 'Item 2', 'Item 3'];

  const [danger, setDanger] = useState("-");
  const [distance, setDistance] = useState("-");

  $travelStats.listen(value => setDanger(value.danger.toString()+" %"));
  
  $travelStats.listen(value => setDistance(value.distance.toString()));

  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg flex space-x-4">
      {/* <List title="Indice de peligrosidad %" items={list1Items}/>
      <List title="Días de reposo %" items={list2Items} /> */}
      <p>Indice de peligrosidad: {danger}</p>
      <p>Distancia (km): {(distance == "0") ? "-" : distance}</p>
      

    </div>
  );
};

export default Comparison;
