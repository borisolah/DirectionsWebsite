import React from "react";
import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapComponent from "./pagecomponents/MapComponent.js";
import { Navbar } from "./pagecomponents/Navbar";
import { useDatabase } from "./databaseconverter/useDatabase";
import HozzadasForm from "./pagecomponents/HozzaadasComponents/HozzadasForm.js";

function App() {
  const [database, loading] = useDatabase();

  if (!loading) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HozzadasForm />
              </>
            }
          />
          <Route
            path="/map"
            element={
              <Box position="relative" overflow="hidden">
                <Navbar isMap />
                <MapComponent />
              </Box>
            }
          />
        </Routes>
      </Router>
    );
  } else {
    return <text>Loading...</text>;
  }
}

export default App;
