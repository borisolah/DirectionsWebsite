const getLatLng = async (streetAddress, cityName) => {
  const encodedAddress = encodeURIComponent(streetAddress);
  const encodedCity = encodeURIComponent(cityName);

  // Check if data already exists in local storage
  const storageKey = `latlng_${encodedAddress}_${encodedCity}`;
  const storedData = localStorage.getItem(storageKey);

  if (storedData) {
    console.log("Using stored coordinates");
    return JSON.parse(storedData);
  }
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress},+${encodedCity}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    return;
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Geocoding error! status: ${data.status}`);
  }

  const lat = data.results[0].geometry.location.lat;
  const lng = data.results[0].geometry.location.lng;

  // Store the data in local storage
  const latLng = { lat, lng };
  localStorage.setItem(storageKey, JSON.stringify(latLng));
  console.log("Fetched and stored new coordinates");

  return latLng;
};

export default getLatLng;
