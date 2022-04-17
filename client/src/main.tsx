import "./index.css";
import "./firebaseApp";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";

const extendedTheme = extendTheme({});

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={extendedTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
