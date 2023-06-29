import {  useState } from "react";
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

} from '@mui/material';
import { toast } from 'react-toastify';
import { MapView } from "../../components/maps/MapView";
import { authApi } from "../../api/authApi";
import { IPuntoInteres } from "../../interfaces/pi";
import { useNavigate } from "react-router-dom";

type RequestSiteProps = {
  onRequestComplete: (result: IPuntoInteres) => void;
};

const RequestSite = ({ onRequestComplete }: RequestSiteProps) =>{
  const [clickedLocation, setClickedLocation] = useState<number[]>([]);
  const navigate = useNavigate();
  const handleLocationClick = (location: number[]) => {
    setClickedLocation(location);
  };

  const formularioLugar = async (data: any)=>{
    if(clickedLocation.length == 0){
      const resMessage = "Error = Ingrese la ubicacion";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if(!data.get("nombre")){
      const resMessage = "Error = Ingrese el nombre";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if(!data.get("direccion")){
      const resMessage = "Error = Ingrese la dirección";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    if(!data.get("telefono")){
      const resMessage = "Error = Ingrese el telefono";
      toast.error(resMessage, {
        position: "top-right",
      });
      return;
    }
    const tel = data.get("telefono");
    const nom = data.get("nombre");
    const dir = data.get("direccion");
    try {
      const res = await authApi.post<IPuntoInteres>("/api/puntosInteres", {
        pi_cel:tel,
        pi_nombre: nom ,
        pi_direccion: dir,
        pi_log: clickedLocation[0],
        pi_lat: clickedLocation[1],
        pi_estado: 'I'
      });
      console.log(res);
      onRequestComplete(res.data);
      navigate("/perfil/solicitud");

    } catch (error: any) {
      const resMessage = error.response?.data?.msg || "Error - datos incorrectos";
      toast.error(resMessage, {
        position: "top-right",
      });
    }
    
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
            <Grid item xs={1} sm={6}>
            <Card>
              <CardHeader title="Ingrese la ubicación del sitio" />
              <Divider />
              <Box >
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
                      id="nombre"
                      label="Nombre del sitio"
                      variant="standard"
                      name="nombre"
                    />
                    <TextField
                      required
                      fullWidth
                      id="direccion"
                      label="Direccion"
                      variant="standard"
                      name="direccion"
                    />
                    <TextField
                      required
                      fullWidth
                      id="telefono"
                      label="Teléfono"
                      variant="standard"
                      name="telefono"
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

export default RequestSite;
