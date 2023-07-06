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
import { toast } from 'react-toastify';
import { MapView } from "../../components/maps/MapView";
import { Category, IDetalleItinerario, tiposAtractivosTuristicos } from "../../interfaces/tipos-lugares";
import CheckIcon from "@mui/icons-material/Check";


type DetalleItinerarioComponentProps = {
  onRequestComplete: (result: IDetalleItinerario[]) => void;
};

const FormularioGuia = ({ onRequestComplete }: DetalleItinerarioComponentProps) => {
  const store = useStore();
  const { setDecodedToken } = useContext(AuthContext);
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
    if (clickedLocation.length === 0) {
      const resMessage = "Error: Seleccione su ubicación";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if (selectedCategories.length === 0) {
      const resMessage = "Error = Seleccione las categorias del sitio";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    const dias = parseInt(data.get("dias"));
    if (dias <= 0) {
      const resMessage = "Error: El número de días debe ser mayor a 0";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if (!data.get("dias")) {
      const resMessage = "Error: Ingrese el número de días";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if (!data.get("fecha")) {
      const resMessage = "Error: Ingrese la fecha en la que iniciará el tour";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    const fecha = new Date(data.get("fecha"));
const fechaActual = new Date();
fechaActual.setHours(0, 0, 0, 0);

if (fecha < fechaActual) {
  const resMessage = "Error: La fecha debe ser mayor o igual a la fecha actual";
  toast.error(resMessage, {
    position: "top-right",
  });
  return;
}

    if (!data.get("hora-i")) {
      const resMessage = "Error: Ingrese la hora de inicio";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if (!data.get("hora-f")) {
      const resMessage = "Error: Ingrese la hora de fin";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }

    const horaInicio = data.get("hora-i");
    const horaFin = data.get("hora-f");
    const minutosInicio = horaInicio.split(":")[0] * 60 + parseInt(horaInicio.split(":")[1]);
    const minutosFin = horaFin.split(":")[0] * 60 + parseInt(horaFin.split(":")[1]);
    const diferenciaMinutos = minutosFin - minutosInicio;

    if (diferenciaMinutos < 60) {
      const resMessage = "Error: El intervalo de tiempo debe ser de al menos 60 minutos";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }

    const detallerItinerario: IDetalleItinerario[] = [
      {
        
      dias: data.get("dias"), 
      fecha: data.get("fecha"),
      horaI: data.get("hora-i"),
      horaF: data.get("hora-f"),
      selectedCategories: selectedCategories,
      ubicacion: [clickedLocation[0],clickedLocation[1]]
    }
    ]
    onRequestComplete(detallerItinerario);
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
              <CardHeader title="Ingrese la ubicación de partida del tour" />

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
              <CardHeader title="Formulario de ingreso de preferencias" />
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
                    defaultValue={new Date().toISOString().slice(0, 10)}
                  />


                  <TextField
                    required
                    fullWidth
                    id="hora-i"
                    label="Hora de inicio:"
                    variant="standard"
                    name="hora-i"
                    type="time"
                    defaultValue="12:00"
                  />
                  <TextField
                    required
                    fullWidth
                    id="hora-f"
                    label="Hora de fin:"
                    variant="standard"
                    name="hora-f"
                    type="time"
                    defaultValue="17:00"
                  />

                  <Autocomplete
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
                        variant="standard"
                        label="Tipos de lugares que desea visitar"
                        placeholder="Tipos de lugares que desea visitar"
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
                 <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <Button
    type="submit"
    variant="contained"
    sx={{ mt: 3, mb: 2 }}
  >
    Generar
  </Button>
</div>

                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </>
  );
};

export default FormularioGuia;