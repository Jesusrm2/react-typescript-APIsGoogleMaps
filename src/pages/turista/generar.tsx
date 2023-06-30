import { useEffect, useContext, useState } from "react";
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";
import {
  Box,
  Card,
  Grid,
  TextField,
  CardHeader,
  Divider,
  CardContent,
  Typography,
  Button,
  Container,
  Autocomplete,
  MenuItem,

} from '@mui/material';
import { MapView } from "../../components/maps/MapView";
import { Category, tiposAtractivosTuristicos } from "../../interfaces/tipos-lugares";
import CheckIcon from "@mui/icons-material/Check";

const GenerateGuide = () => {
  const store = useStore();
  const {setDecodedToken } = useContext(AuthContext);
  const [clickedLocation, setClickedLocation] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const handleLocationClick = (location: number[]) => {
    setClickedLocation(location);
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

  const formularioLugar = async (data: any) => {
      console.log(data.get("dias"))
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    formularioLugar(data);
  };


  return (
    <>
      <div><h1>.</h1></div>

      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={100} sm={6}>
            <Card>
              <CardHeader title="Ingrese la ubicación del sitio" />

              <Divider />
              <Box  >
              
                <MapView onLocationClick={handleLocationClick} />
                {clickedLocation.length > 0 && (
                  <div>
                    <Typography gutterBottom variant="subtitle2">Ubicación = Latitude: {clickedLocation[1]}, Longitude: {clickedLocation[0]}</Typography>
                  </div>
                )}
                
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title="Ingrese la información del sitio que desea solicitar el registro" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '72ch' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="dias"
                    label="Número de días:"
                    variant="standard"
                    name="dias"
                  />

                 <TextField
  required
  fullWidth
  id="fecha"
  label="Fecha"
  variant="standard"
  name="fecha"
  type="date"
/><TextField
  required
  fullWidth
  id="hora-i"
  label="Hora de inicio:"
  variant="standard"
  name="hora-i"
  type="time"
/>
<TextField
  required
  fullWidth
  id="hora-f"
  label="Hora de fin:"
  variant="standard"
  name="hora-f"
  type="time"
/>
<Typography
                    sx={{
                      pb: 0.5,
                      pt: 2
                    }}
                    variant="h4"
                  >
                    Seleccione sus preferencias:
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

export default GenerateGuide;