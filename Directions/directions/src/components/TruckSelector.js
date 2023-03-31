import React from "react";
import { Select } from "@chakra-ui/react";

const TruckSelector = ({ selectedTruck, setSelectedTruck, trucks }) => {
  return (
    <Select
      value={selectedTruck}
      onChange={(e) => setSelectedTruck(e.target.value)}
    >
      {trucks.map((truck, index) => (
        <option key={index} value={truck}>
          {truck}
        </option>
      ))}
    </Select>
  );
};

export default TruckSelector;
