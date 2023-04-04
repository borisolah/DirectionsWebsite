const useHandleClick = (
  selectedTruck,
  setSelectedTruck,
  markerData,
  setMarkerData,
  addresses,
  groupMarkersByTruck,
  calculateDirections
) => {
  const handleClick = async (markerIndex) => {
    if (selectedTruck !== "Marks Without A Truck") {
      const truckNumber = selectedTruck.split(" ")[1];
      const updatedMarkerData = [...markerData];

      if (updatedMarkerData[markerIndex].truck !== parseInt(truckNumber)) {
        updatedMarkerData[markerIndex].truck = parseInt(truckNumber);
      } else {
        updatedMarkerData[markerIndex].truck = null;
      }

      setMarkerData(updatedMarkerData);

      // Recalculate directions with the updated markerData
      const markersByTruck = groupMarkersByTruck(
        updatedMarkerData,
        addresses,
        selectedTruck
      );
      await calculateDirections(selectedTruck, markersByTruck);
    }
  };

  return handleClick;
};

export default useHandleClick;
