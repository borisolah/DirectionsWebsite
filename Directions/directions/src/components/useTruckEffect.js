import { useEffect } from "react";

export const useTruckEffect = (
  database,
  addresses,
  selectedTruck,
  startingPoint,
  setDirections,
  setDirectionsError,
  setDistance,
  setDuration,
  setOrderedAddresses,
  groupMarkersByTruck,
  calculateDirections
) => {
  useEffect(() => {
    let markersByTruck = groupMarkersByTruck(
      database,
      addresses,
      selectedTruck
    );

    markersByTruck = markersByTruck.filter((marker) => {
      if (selectedTruck !== "Marks Without A Truck") {
        return database[marker.id]?.truck;
      }
      return true;
    });
    markersByTruck.unshift(startingPoint);
    markersByTruck.push(startingPoint);

    calculateDirections(selectedTruck, markersByTruck);
  }, [selectedTruck, database, addresses]);
};
