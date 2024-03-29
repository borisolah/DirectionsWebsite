import { Box, Flex, HStack, Text, Select } from "@chakra-ui/react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import database from "./database";
import { useState, useEffect } from "react";
import getAddress from "./components/getAdress";
import TruckSelector from "./components/TruckSelector";
import LocationsList from "./components/LocationsList";
import {
  truckColors,
  startingPoint,
  center,
  trucks,
} from "./components/constants";
import { useIsLoaded } from "./components/useIsLoaded";
function App() {
  const isLoaded = useIsLoaded();
  const [orderedAddresses, setOrderedAddresses] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState(trucks[0]);
  const [directions, setDirections] = useState(null);
  const [directionsError, setDirectionsError] = useState(null);
  const [markerData, setMarkerData] = useState(database);

  async function handleClick(markerIndex) {
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
  }

  function createNumberedColoredMarkerIcon(color, number) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12C0 18.6 12 36 12 36S24 18.6 24 12C24 5.4 18.6 0 12 0Z" fill="${color}" stroke="black" stroke-width="2" />
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12px" font-weight="bold" fill="white">${number}</text>
    </svg>`;

    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      anchor: new window.google.maps.Point(12, 36),
      scaledSize: new window.google.maps.Size(24, 36),
    };
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
        console.log("Directions API has been used");

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

  function formatDuration(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    return `${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds > 0 ? seconds + "s" : ""}`;
  }

  function formatDistance(distance) {
    const kilometers = (distance / 1000).toFixed(2);
    return `${kilometers} km`;
  }

  async function fetchBatchAddresses(positions, apiKey) {
    const requests = positions.map((position) =>
      getAddress(position.lat, position.lng, apiKey)
    );
    const results = await Promise.allSettled(requests);

    return results.map((result) =>
      result.status === "fulfilled" ? result.value : "Not found"
    );
  }
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

    // Add startingPoint to the beginning and end of the markers array.
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
  }, [selectedTruck, database, addresses]);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);

      const batchSize = 10;
      for (let i = 0; i < database.length; i += batchSize) {
        const positionBatch = database.slice(i, i + batchSize);
        try {
          const batchAddresses = await fetchBatchAddresses(
            positionBatch,
            `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          console.log("Geocoding API has been used");

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

      setLoading(false);
    };

    if (isLoaded) {
      fetchAddresses();
    }
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

function parseSerializedString(serializedString) {
  const regex = /"([^"]*)"/g;
  let match;
  const result = {};

  while ((match = regex.exec(serializedString)) !== null) {
    const key = match[1];
    match = regex.exec(serializedString);
    const value = match[1];
    result[key] = value;
  }

  return result;
}

function extractSenderAndReceiverInfo(database) {
  const senderInformation = [];
  const receiverInformation = [];

  for (const item of database) {
    const pckSenderString = item.pck_sender;
    const pckSenderObject = parseSerializedString(pckSenderString);
    senderInformation.push(pckSenderObject);

    const pckReceiverString = item.pck_receiver;
    const pckReceiverObject = parseSerializedString(pckReceiverString);
    receiverInformation.push(pckReceiverObject);
  }

  return { senderInformation, receiverInformation };
}
