import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/output.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./providers/app.provider.tsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <AppProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <App />
            </LocalizationProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </AppProvider>
    </StrictMode>
  </BrowserRouter>
);
