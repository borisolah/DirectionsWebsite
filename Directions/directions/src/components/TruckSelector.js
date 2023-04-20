import React from "react";
import { Select } from "@chakra-ui/react";

const TruckSelector = ({ selectedTruck, setSelectedTruck, trucks }) => {
  return (
    <Select
      value={selectedTruck?._id}
      onChange={(e) =>
        setSelectedTruck(trucks.find((truck) => truck._id === e.target.value))
      }
    >
      {trucks.map((truck, index) => (
        <option key={index} value={truck._id}>
          {truck.autoNeve}
        </option>
      ))}
    </Select>
  );
};

export default TruckSelector;
