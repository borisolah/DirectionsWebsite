import { Box, Flex, HStack, Text, Select } from "@chakra-ui/react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import extractSenderAndReceiverInfo from "./databaseconverter/extractInfo";
import { useDatabase } from "./databaseconverter/useDatabase";
import {
  getAddress,
  TruckSelector,
  LocationsList,
  createNumberedColoredMarkerIcon,
  formatDistance,
  formatDuration,
  truckColors,
  startingPoint,
  center,
  trucks,
} from "./components";
import { useIsLoaded } from "./components/useIsLoaded";
import getLatLng from "./components/getLatLng";
function App() {
  const isLoaded = useIsLoaded();
  const [orderedAddresses, setOrderedAddresses] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loadingadresses, setLoadingAdresses] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState(trucks[0]);
  const [directions, setDirections] = useState(null);
  const [directionsError, setDirectionsError] = useState(null);
  const [database, loading] = useDatabase();
  const [markerData, setMarkerData] = useState(database);

  const { senderInformation, receiverInformation } =
    extractSenderAndReceiverInfo(database);

  async function handleClick(markerIndex) {
    console.log("database", database);
    console.log("markerData", markerData);
    if (selectedTruck !== "Marks Without A Truck") {
      const truckNumber = selectedTruck.split(" ")[1];
      const updatedMarkerData = [...markerData];
      console.log(updatedMarkerData, "updatedmarkerdata is empty");

      const markersByTruck = groupMarkersByTruck(database, selectedTruck);
      const markerId = markersByTruck[markerIndex].id;

      if (updatedMarkerData[markerId].truck !== parseInt(truckNumber)) {
        updatedMarkerData[markerId].truck = parseInt(truckNumber);
      } else {
        updatedMarkerData[markerId].truck = null;
      }

      setMarkerData(updatedMarkerData);

      await calculateDirections(selectedTruck, markersByTruck);
    }
  }

  async function calculateDirections(truck, markers) {
    if (markers.length < 2 || truck === "Marks Without A Truck") {
      setDirections(null);
      setDirectionsError(null);
      return;
    }

    const origin = markers[0];
    const destination = markers[markers.length - 1];
    const waypoints = markers.filter((m) => `Truck ${m.truck}` === truck);

    const MAX_WAYPOINTS = 25;
    const numLegs = Math.floor(1, Math.ceil(waypoints.length / MAX_WAYPOINTS));
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

  function groupMarkersByTruck(database, selectedTruck) {
    const markersByTruck = {};

    for (let i = 0; i < database.length; i++) {
      const position = database[i];
      const truck = database[i].truck;

      if (!truck) {
        if (!markersByTruck["NoTruck"]) {
          markersByTruck["NoTruck"] = [];
        }
        markersByTruck["NoTruck"].push({ ...position, id: i });
      } else if (
        selectedTruck === `Truck ${truck}` ||
        (selectedTruck === "Marks Without A Truck" && !database[i].truck)
      ) {
        if (!markersByTruck[truck]) {
          markersByTruck[truck] = [];
        }
        markersByTruck[truck].push({ ...position, id: i });
      }
    }

    for (const truck in markersByTruck) {
      markersByTruck[truck].unshift(startingPoint);
      markersByTruck[truck].push(startingPoint);
    }

    if (!selectedTruck) {
      return Object.values(markersByTruck).flat();
    }

    if (selectedTruck === "Marks Without A Truck") {
      return markersByTruck["NoTruck"] || [];
    }

    const selectedTruckMarkers =
      markersByTruck[
        selectedTruck === "Marks Without A Truck"
          ? "NoTruck"
          : selectedTruck.split(" ")[1]
      ] || [];

    return [...selectedTruckMarkers, ...(markersByTruck["NoTruck"] || [])];
  }

  async function fetchBatchAddresses(positions) {
    const requests = positions.map((position) =>
      getLatLng(position.address_street, position.address_city)
    );
    const results = await Promise.allSettled(requests);

    return results.map((result) =>
      result.status === "fulfilled" ? result.value : "Not found"
    );
  }
  useEffect(() => {
    let markersByTruck = groupMarkersByTruck(database, selectedTruck);

    markersByTruck = markersByTruck.filter((marker) => {
      if (selectedTruck !== "Marks Without A Truck") {
        return database[marker.id]?.truck;
      }
      return true;
    });

    markersByTruck.unshift(startingPoint);
    markersByTruck.push(startingPoint);

    if (selectedTruck === "Marks Without A Truck") {
      setDirections(null);
      setDirectionsError(null);
      setDistance(0);
      setDuration(0);
      setOrderedAddresses([]);
    } else {
      calculateDirections(selectedTruck, markersByTruck);
    }
  }, [selectedTruck, database]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAdresses(true);

      const batchSize = 10;
      for (let i = 0; i < receiverInformation.length; i += batchSize) {
        const positionBatch = receiverInformation.slice(i, i + batchSize);

        try {
          const batchAddresses = await fetchBatchAddresses(
            positionBatch,
            `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );

          setAddresses((prevAddresses) => [
            ...prevAddresses.slice(0, i),
            ...batchAddresses,
            ...prevAddresses.slice(i + batchSize),
          ]);
        } catch (error) {
          console.error(error);
          setAddresses((prevAddresses) => [
            ...prevAddresses.slice(0, i),
            ...Array(positionBatch.length).fill("Not found"),
            ...prevAddresses.slice(i + batchSize),
          ]);
        }
      }

      setLoadingAdresses(false);
    };

    if (isLoaded) {
      fetchAddresses();
    }
  }, [isLoaded, database]);

  if (loading || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
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
          {groupMarkersByTruck(database, selectedTruck)
            .filter((position) => {
              return !(position.lat === 13 && position.lng === 0);
            })
            .map((position, index) => {
              const isStartingOrEndingPoint =
                index === 0 ||
                index ===
                  groupMarkersByTruck(database, selectedTruck).length - 1;
              const truck = database.find(
                (entry) =>
                  entry.lat === position.lat && entry.lng === position.lng
              )?.truck;
              const color = isStartingOrEndingPoint
                ? "black"
                : truckColors[`Truck ${truck}`] || truckColors["NoTruck"];

              return (
                <Marker
                  key={index}
                  position={{ lat: position.lat, lng: position.lng }}
                  draggable={false}
                  icon={createNumberedColoredMarkerIcon(color, 1)}
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
            trucks={["Marks Without A Truck", ...trucks]}
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
    </Flex>
  );
}

export default App;
