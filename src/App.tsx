import { useRoutes } from "react-router-dom";
import routes from "./router";
import { CssBaseline } from "@mui/material";
import ThemeProvider from "./theme/ThemeProvider";
import { AuthProvider } from "./contexts/auth/authContext";

function App() {
  const content = useRoutes(routes);
  return (
    <AuthProvider>
    <ThemeProvider>
        <CssBaseline />
        {content}
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
