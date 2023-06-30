import { useEffect, useContext, useState } from "react";
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { IPuntoInteres } from "../../interfaces/pi";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from 'react-toastify';
import { ISolicitud } from "../../interfaces/solicitud";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { ICategoria } from "../../interfaces/categoria";
import { Category, tiposAtractivosTuristicos } from "../../interfaces/tipos-lugares";


type SolicitudComponentProps = {
  responseValue: IPuntoInteres | null;
};

const Solicitud = ({ responseValue }: SolicitudComponentProps) => {
  const store = useStore();
  const user = store.authUser;
  const { decodedToken, setDecodedToken } = useContext(AuthContext);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const solicitud = async (data: any) => {
    console.log(responseValue);
    console.log(data.get("coment"));
    console.log(user?.per_id);
    console.log(decodedToken);
    console.log(selectedCategories);
    if (selectedCategories.length === 0) {
      const resMessage = "Error = Seleccione las categorias del sitio";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if (!data.get("coment")) {
      const resMessage = "Error = Ingrese el motivo de su solicitud";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    try {
      const currentDate = new Date(); 
      const year = currentDate.getFullYear(); 
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); 
      const day = String(currentDate.getDate()).padStart(2, "0"); 

      const formattedDate = `${year}-${month}-${day}`;
      const res = await authApi.post<ISolicitud>("/api/piSolicitudes", {
        pi_id: responseValue?.pi_id,
        per_id: user?.per_id,
        pi_soli_fecha: formattedDate,
        pi_soli_descripcion: data.get("coment"),
        pi_soli_estado: 'I'
      });

      for (let i = 0; i < selectedCategories.length; i++) {
        const tipoAtractivo = selectedCategories[i];
        const res2 = await authApi.post<ICategoria>("/api/categoria", {
          pi_id: responseValue?.pi_id,
          cat_nombre:  tipoAtractivo.type,
          cat_estado: 'A'
        });
        console.log(res2);
      }
      console.log(res);
      navigate("/perfil/estado")
    } catch (error: any) {
      const resMessage = error.response?.data?.msg || "Error - datos incorrectos";
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    // Verificar si hay un usuario almacenado en el almacenamiento local
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      store.setAuthUser(JSON.parse(storedUser));
    }
    // Verificar si hay un token decodificado almacenado en el almacenamiento local
    const storedDecodedToken = localStorage.getItem("decodedToken");
    if (storedDecodedToken) {
      const decodedToken = JSON.parse(storedDecodedToken);
      setDecodedToken(decodedToken); // Establecer el valor de decodedToken en el contexto
    }
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    solicitud(data);
  };



  return (
    <>
      <div>
        <h1>.</h1>
      </div>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={100} sm={5}>
            <Card>
              <CardHeader title="Imagenes del sitio" />
              <Divider />
              <Box p={2}>
                <Box pl={2}>
                  <Typography variant="h4" gutterBottom>
                    Local: {responseValue?.pi_nombre}
                  </Typography>
                  <Typography color="text.primary" sx={{ pb: 2 }}>
                    Propietario: {user?.per_nombres}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddTwoToneIcon />}
                  >
                    Añadir foto
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title="Finalizar solicitud" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    "& .MuiTextField-root": { m: 1, width: "72ch" }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    required
                    fullWidth
                    id="coment"
                    label="Motivo de solicitud"
                    variant="standard"
                    name="coment"
                  />

                  <Typography
                    sx={{
                      pb: 0.5,
                      pt: 2
                    }}
                    variant="h4"
                  >
                    Seleccione las categorias de su sitio:
                  </Typography>
                  <Autocomplete
  sx={{ m: 1, width: 500 }}
  multiple
  options={tiposAtractivosTuristicos}
  getOptionLabel={(option) => option.label}
  disableCloseOnSelect
  value={selectedCategories}
  onChange={(event, value) => {
    if (event) {
      setSelectedCategories(value as Category[]);
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      label="Categorías"
      placeholder="Categorías"
    />
  )}
  renderOption={(props, option, { selected }) => (
    <MenuItem
      {...props}
      key={option.type}
      value={option.type}
      sx={{ justifyContent: "space-between" }}
    >
      {option.label}
      {selected ? <CheckIcon color="info" /> : null}
    </MenuItem>
  )}
/>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Siguiente
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Solicitud;
