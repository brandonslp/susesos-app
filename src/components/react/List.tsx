// src/components/ExpandableLists.js
import React, { useState } from 'react';
import ItemList from "./ItemList";
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

export interface Props {
  title: string;
  items: string[];
}

const Lists = ({title, items}: Props) => {
  const [isListOpen, setListOpen] = useState(false);

  const toggleList = () => {
    setListOpen(!isListOpen);
  };

  return (
    <div className="w-1/2">
      <div className="flex items-center cursor-pointer" onClick={toggleList}>
        {isListOpen ? <FiChevronDown className="mr-2" /> : <FiChevronRight className="mr-2" />}
        {title}
      </div>
      {isListOpen && (
        <div className="pl-4">
          {items.map((item, index) => (
            <ItemList text={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lists;
