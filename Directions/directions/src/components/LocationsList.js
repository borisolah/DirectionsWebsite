import React from "react";
import { Text } from "@chakra-ui/react";

const LocationsList = ({ addresses, database }) => {
  const filteredAddresses = addresses.filter(
    (_, index) => !database[index].truck
  );

  return (
    <div>
      <Text fontWeight="bold">Locations:</Text>
      <ul>
        {filteredAddresses.map((address, index) => (
          <div key={index}>
            <Text>{address}</Text>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default LocationsList;
