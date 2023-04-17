import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { ChakraProvider, theme } from "@chakra-ui/react";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  rootElement
);
