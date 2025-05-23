import { createRoot } from "react-dom/client";

// third party
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// project imports
import App from "./App";
import reducer from "./store/reducer";

// google-fonts
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/700.css";

// style + assets
import "assets/scss/style.scss";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const store = configureStore({ reducer });

// ==============================|| REACT DOM RENDER  ||============================== //

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
