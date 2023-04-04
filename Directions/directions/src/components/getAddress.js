const getAddress = async (streetAddress, cityName) => {
  const encodedAddress = encodeURIComponent(streetAddress);
  const encodedCity = encodeURIComponent(cityName);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress},+${encodedCity}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
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
