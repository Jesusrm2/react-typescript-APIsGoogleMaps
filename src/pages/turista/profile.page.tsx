import { useContext, useEffect} from "react";
import { toast } from "react-toastify";
import { authApi } from "../../api/authApi";
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";
import jwtDecode from "jwt-decode";
import { Ipersona } from "../../api/types";
import { Box, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import Text from '../../components/Text/';

const ProfilePage = () => {
  const store = useStore();
  const { token, setToken} = useContext(AuthContext);
  //const [decodedToken, setDecodedToken] = useState<any>(null);
  const { decodedToken, setDecodedToken } = useContext(AuthContext);

  const getUser = async (decoded: any) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.get<Ipersona>(`api/personas/${decoded?.per_id}`);
      store.setRequestLoading(false);
      store.setAuthUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("decodedToken", JSON.stringify(decoded));
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    // Verificar si hay un token almacenado en el almacenamiento local
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // Guardar el token en el almacenamiento local cuando cambie
    localStorage.setItem("token", token || "");
    
    // Decodificar el token JWT para obtener la información
    let decodedToken: any = null;
    if (token) {
      try {
        decodedToken = jwtDecode(token);
        setDecodedToken(decodedToken);
      } catch (error) {
        // Manejar errores al decodificar el token
        console.error("Error al decodificar el token:", error);
      }
    }

    if (decodedToken) {

      getUser(decodedToken);
    }
  }, [token]);

  const user = store.authUser;

  return (
    <>
      <div><h1>.</h1></div>
      <Grid item xs={12}>
        <Card>
          <Box
            p={3}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" gutterBottom>
                Detalles personales
              </Typography>
              <Typography variant="subtitle2">
                Información relacionada con tus detalles personales de la cuenta turista
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle2">
              <Grid container spacing={0}>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Nombre:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{user?.per_nombres} </b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Apellido:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>{user?.per_apellidos}</b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3} pb={2}>
                    Correo:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Box sx={{ maxWidth: { xs: 'auto', sm: 300 } }}>
                    <Text color="black">
                    {decodedToken && typeof decodedToken === 'object' && decodedToken.usu_email}
                    </Text>
                  </Box>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ProfilePage;
