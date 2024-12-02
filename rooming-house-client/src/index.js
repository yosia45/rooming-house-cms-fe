import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import router from "./routers";
import { RouterProvider } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
// import store from "./store";
// import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <MantineProvider>
      <RouterProvider router={router} />
      {/* <App /> */}
    </MantineProvider>
    {/* </Provider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
