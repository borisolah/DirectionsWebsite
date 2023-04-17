import getLatLng from "./getLatLng";

async function fetchBatchAddresses(positions, apiKey) {
  const requests = positions.map((position) =>
    getLatLng(position.address_street, position.address_city, apiKey)
  );
  const results = await Promise.allSettled(requests);
  console.log("RESULTS",results)

  return results.map((result) =>
    result.status === "fulfilled" ? result.value : "Not found"
  );
}

export default fetchBatchAddresses;
