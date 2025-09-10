import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import GlobalStyle from "./styles/GlobalStyle";
import { ToastProvider } from "./contexts/ToastContext"; // <-- Importe o Provider

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        {" "}
        {/* <-- Envolva a aplicação */}
        <GlobalStyle />
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
