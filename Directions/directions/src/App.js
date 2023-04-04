import React from "react";
import MapComponent from "./components/MapComponent.js";
import { useDatabase } from "./databaseconverter/useDatabase";

function App() {
  const [database, loading] = useDatabase();

  if (!loading) {
    console.log(database);
    return <MapComponent />;
  } else {
    return <text>Loading...</text>;
  }
}

export default App;
