// components/getAdress.js
const getAddress = async (lat, lng, apiKey) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Geocoding error! status: ${data.status}`);
  }

  return data.results[0].formatted_address;
};

export default getAddress;
