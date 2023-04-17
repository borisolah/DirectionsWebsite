const getLatLng = async (streetAddress, cityName) => {
  const encodedAddress = encodeURIComponent(streetAddress);
  const encodedCity = encodeURIComponent(cityName);

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

  const latLng = { lat, lng };

  return latLng;
};

export default getLatLng;
