// src/components/ExpandableLists.js
import List from "./List";

const Comparison = () => {

  const list1Items = ['Item 1', 'Item 2', 'Item 3'];
  const list2Items = ['Item 1', 'Item 2', 'Item 3'];

  return (
    <div className="max-w-screen-lg mx-auto mt-8 p-4 bg-gray-200 rounded-lg flex space-x-4">
      <List title="Indice de peligrosidad %" items={list1Items}/>
      <List title="Días de reposo %" items={list2Items} />
    </div>
  );
};

export default Comparison;
