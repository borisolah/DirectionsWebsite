async function getAddress(lat, lng) {
  const geocoder = new window.google.maps.Geocoder();
  const latLng = new window.google.maps.LatLng(lat, lng);

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        resolve(results[0].formatted_address);
      } else {
        reject("Geocode was not successful: " + status);
      }
    });
  });
}
export default getAddress;
