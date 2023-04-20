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
    const truckNumber = selectedTruck._id;
    const updatedMarkerData = [...markerData];
    if (updatedMarkerData[markerIndex].truck !== truckNumber) {
      updatedMarkerData[markerIndex].truck = truckNumber;
    } else {
      updatedMarkerData[markerIndex].truck = null;
    }
    setMarkerData(updatedMarkerData);
    const markersByTruck = groupMarkersByTruck(
      updatedMarkerData,
      addresses,
      selectedTruck
    );
    await calculateDirections(selectedTruck, markersByTruck);
  };

  return handleClick;
};

export default useHandleClick;
