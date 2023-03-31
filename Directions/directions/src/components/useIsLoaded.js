import { useJsApiLoader } from "@react-google-maps/api";

export function useIsLoaded() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
  });

  return isLoaded;
}
