import { Box, Flex, HStack, VStack, Text, Select } from "@chakra-ui/react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useDatabase } from "../databaseconverter/useDatabase";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useTruckEffect } from "../components/useTruckEffect";
import {
  formatDistance,
  formatDuration,
  createNumberedColoredMarkerIcon,
  useHandleClick,
  TruckSelector,
  LocationsList,
  truckColors,
  startingPoint,
  center,
} from "../components";
import { useIsLoaded } from "../components/useIsLoaded";

export default function MapComponent({ database, trucks }) {
  const isLoaded = useIsLoaded();
  const [orderedAddresses, setOrderedAddresses] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState(trucks[0]);
  const [directions, setDirections] = useState(null);
  const [directionsError, setDirectionsError] = useState(null);
  const [markerData, setMarkerData] = useState([]);
  const [, databaseLoading, nulledItems] = useDatabase();

  useEffect(() => {
    if (!loading) {
      setMarkerData(database);
    }
  }, [loading, database]);

  const handleClick = useHandleClick(
    selectedTruck,
    setSelectedTruck,
    markerData,
    setMarkerData,
    addresses,
    groupMarkersByTruck,
    calculateDirections
  );
  async function calculateDirections(truck, markers) {
    if (markers.length < 2 || truck === "Marks Without A Truck") {
      setDirections(null);
      setDirectionsError(null);
      console.log("No truck or not enough markers, skipping...");
      return;
    }
    console.log(truck);

    const origin = markers[0];
    const destination = markers[markers.length - 1];
    const waypoints = markers.filter((m) => m.truck === truck._id);

    const MAX_WAYPOINTS = 25;
    const numLegs = Math.max(1, Math.ceil(waypoints.length / MAX_WAYPOINTS));

    const legs = [];

    for (let i = 0; i < numLegs; i++) {
      const start = i * MAX_WAYPOINTS;
      const end = Math.min((i + 1) * MAX_WAYPOINTS, waypoints.length);
      const currentLegWaypoints = waypoints.slice(start, end).map((marker) => ({
        location: new window.google.maps.LatLng(marker.lat, marker.lng),
      }));

      const currentOrigin = i === 0 ? origin : waypoints[start - 1];
      const currentDestination =
        i === numLegs - 1 ? destination : waypoints[end];

      const legResult = await new Promise((resolve, reject) => {
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin: new window.google.maps.LatLng(
              currentOrigin.lat,
              currentOrigin.lng
            ),
            destination: new window.google.maps.LatLng(
              currentDestination.lat,
              currentDestination.lng
            ),
            travelMode: window.google.maps.TravelMode.DRIVING,
            waypoints: currentLegWaypoints,
            optimizeWaypoints: true,
            provideRouteAlternatives: false,
            avoidTolls: false,
            avoidHighways: false,
            avoidFerries: false,
            unitSystem: window.google.maps.UnitSystem.IMPERIAL,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              const waypointOrder = result.routes[0].waypoint_order;
              const orderedTruckAddresses = waypointOrder.map(
                (index) => addresses[markers[index + 1].id]
              );
              setOrderedAddresses(orderedTruckAddresses);
              resolve(result);
            } else {
              reject(`Error fetching directions: ${status}`);
            }
          }
        );
      }).catch((error) => {
        console.error("Error fetching directions:", error);
        setDirections(null);
        setDirectionsError(error);
        setDistance(0);
        setDuration(0);
      });

      if (legResult) {
        legs.push(legResult);
      } else {
        return;
      }
    }

    const mergedResult = legs[0];
    for (let i = 1; i < legs.length; i++) {
      const currentLeg = legs[i];
      const currentLegRoute = currentLeg.routes[0];

      mergedResult.routes[0].legs.push(...currentLegRoute.legs);
      mergedResult.routes[0].overview_path.push(
        ...currentLegRoute.overview_path
      );
    }

    setDirections(mergedResult);
    setDirectionsError(null);

    const route = mergedResult.routes[0];
    let totalDistance = 0;
    let totalDuration = 0;

    for (const leg of route.legs) {
      totalDistance += leg.distance.value;
      totalDuration += leg.duration.value;
    }

    setDistance(totalDistance);
    setDuration(totalDuration);
  }

  function groupMarkersByTruck(database, addresses, selectedTruck) {
    const markersByTruck = {};

    for (let i = 0; i < database.length; i++) {
      const position = database[i];
      const truckId = database[i].truck;

      if (!truckId) {
        if (!markersByTruck["NoTruck"]) {
          markersByTruck["NoTruck"] = [];
        }
        markersByTruck["NoTruck"].push({ ...position, id: i });
      } else if (selectedTruck._id === truckId || !selectedTruck._id) {
        if (!markersByTruck[truckId]) {
          markersByTruck[truckId] = [];
        }
        markersByTruck[truckId].push({ ...position, id: i });
      }
    }

    for (const truckId in markersByTruck) {
      const startingPoint = {
        lat: selectedTruck.telephely.lat,
        lng: selectedTruck.telephely.lng,
      };
      const endingPoint = {
        lat: selectedTruck.telephely.lat,
        lng: selectedTruck.telephely.lng,
      };

      markersByTruck[truckId].unshift(startingPoint);
      markersByTruck[truckId].push(endingPoint);
    }

    if (!selectedTruck._id) {
      const allMarkers = Object.values(markersByTruck).flat();
      return allMarkers;
    }

    const selectedTruckMarkers = markersByTruck[selectedTruck._id] || [];

    const markersWithoutTruck = markersByTruck["NoTruck"] || [];

    return [...selectedTruckMarkers, ...markersWithoutTruck];
  }

  useTruckEffect(
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
  );

  useEffect(() => {
    const newAddresses = [];

    for (let i = 0; i < database.length; i++) {
      let address =
        database[i].pck_receiver.address_city +
        ", " +
        database[i].pck_receiver.address_street +
        ", " +
        database[i].pck_receiver.address_zip +
        " Hungary";
      newAddresses.push(address);
    }

    setAddresses(newAddresses);
    setLoading(false);
  }, [isLoaded, database]);

  if (!isLoaded) {
    return <h2>Loading...</h2>;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Navbar isMap /> // Add this line
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/*Google Maps Part */}
        <GoogleMap
          center={center}
          zoom={8} // set your desired constant zoom level here
          mapContainerStyle={{ width: "100vw", height: "100vh" }}
          options={{
            gestureHandling: "cooperative", // disable zoom and pan gestures
            zoomControl: true, // hide zoom control
            streetViewControl: false,
            fullscreenControl: false,
            scrollwheel: true, // enable zooming with the mouse wheel
            mapTypeControl: false,
          }}
        >
          {groupMarkersByTruck(database, addresses, selectedTruck)
            .filter((position) => {
              // Filter out the marker you want to remove by checking its coordinates
              return position.lat !== 13 && position.lng !== 0;
            })
            .map((position, index) => {
              const isStartingOrEndingPoint =
                index === 0 ||
                index ===
                  groupMarkersByTruck(database, addresses, selectedTruck)
                    .length -
                    1;
              const truck = database.find(
                (entry) =>
                  entry.lat === position.lat && entry.lng === position.lng
              )?.truck;
              const color = isStartingOrEndingPoint
                ? "black"
                : truck
                ? "blue"
                : truckColors["NoTruck"];

              return (
                <Marker
                  key={index}
                  position={{ lat: position.lat, lng: position.lng }}
                  draggable={false}
                  icon={createNumberedColoredMarkerIcon(color)}
                  onClick={() => handleClick(position.id)}
                />
              );
            })}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ preserveViewport: true, suppressMarkers: true }}
            />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        mt={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="modal"
      >
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <TruckSelector
            selectedTruck={selectedTruck}
            setSelectedTruck={setSelectedTruck}
            trucks={[...trucks]}
          />
        </HStack>
      </Box>
      <Box
        position="absolute"
        left={4}
        top={4}
        p={4}
        borderRadius="lg"
        bgColor="white"
        shadow="base"
        zIndex="modal"
      >
        <LocationsList addresses={addresses} database={database} />
      </Box>
      <Box
        position="absolute"
        right={4}
        top={4}
        p={4}
        borderRadius="lg"
        bgColor="white"
        shadow="base"
        zIndex="modal"
      >
        <Text fontWeight="bold">Total Distance:</Text>
        <Text>{formatDistance(distance)}</Text>
        <Text fontWeight="bold">Total Duration:</Text>
        <Text>{formatDuration(duration)}</Text>
        <Text fontWeight="bold">Selected Truck Locations:</Text>
        <ul>
          {orderedAddresses.map((address, index) => (
            <div key={index}>{<Text>{address}</Text>}</div>
          ))}
        </ul>
      </Box>
      {!databaseLoading && nulledItems.length > 0 && (
        <Box
          position="absolute"
          right={4}
          bottom={4}
          p={4}
          borderRadius="lg"
          bgColor="white"
          shadow="base"
          zIndex="modal"
        >
          <Text fontWeight="bold">List of items with null properties:</Text>
          <VStack spacing={2} align="start">
            {nulledItems.map((item) => (
              <Box key={item.pck_ID}>
                <Text>{`KAPJA: ${item.pck_receiver}`}</Text>
                <Text>{`KÜLDI: ${item.pck_sender}`}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Flex>
  );
}
