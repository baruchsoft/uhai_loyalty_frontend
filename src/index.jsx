import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Toaster
        reverseOrder={false}
        toastOptions={{
          duration: 6000,
          style: {
            backgroundColor: "#333",
            color: "#fff",
            fontSize: "12px",
            borderRadius: "4px",
            padding: "4px",
            fontWeight: "600",
          },
          success: {
            style: { background: "green" },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
    </PersistGate>
  </Provider>
);
