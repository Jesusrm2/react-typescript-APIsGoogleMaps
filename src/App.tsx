import { useRoutes } from "react-router-dom";
import routes from "./router";
import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { AuthProvider } from "./contexts/auth/authContext";
import { MapProvider } from "./contexts/maps/MapProvider";
import { PlacesProvider } from "./contexts/places/PlacesProvider";

function App() {
  const content = useRoutes(routes);
  return (
    <AuthProvider>
      <PlacesProvider>
        <MapProvider>
          <ThemeProvider>

            <CssBaseline />
            {content}

          </ThemeProvider>
        </MapProvider>
      </PlacesProvider>
    </AuthProvider>
  );
}

export default App;
