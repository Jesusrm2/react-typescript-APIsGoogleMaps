import { useEffect, useContext, useState, useLayoutEffect, useRef } from "react";
import { addMinutes, format, parseISO } from 'date-fns';
import useStore from "../../store";
import AuthContext from "../../contexts/auth/authContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from "@mui/material";
import { IDetalleItinerario, tiposAtractivosTuristicos } from "../../interfaces/tipos-lugares";
import { AnySourceData, LngLat, LngLatBounds, LngLatLike, Map, Marker, Popup } from "mapbox-gl";
import { MapContext } from "../../contexts/maps/MapConetxt";
import directionsApi from "../../api/directions";
import { DirectionsResponse } from "../../interfaces/directions";
import LoadingScreen from "../../components/LoadingScreem";
import React from "react";
import StarIcon from '@mui/icons-material/Star';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import ModalCalificacion from "../../components/itinerario/modalCalificacion";
import { Result } from "../../interfaces/poi";

type DetalleItinerarioComponentProps = {
  responseValue: IDetalleItinerario | null;
};

const Itinerario = ({ responseValue }: DetalleItinerarioComponentProps) => {
  const store = useStore();
  const user = store.authUser;
  const { decodedToken, setDecodedToken } = useContext(AuthContext);
  const [pois, setPuntosInteres] = useState<Result[]>([]);
  const [randomPois, setRandomPois] = useState<any[]>([]);
  const mapDiv = useRef<HTMLDivElement>(null);
  const { map, setMap } = useContext(MapContext);
  const { setPois, poi } = useContext(MapContext);
  const [createdMarkers, setCreatedMarkers] = useState<Marker[]>([]);
  const [layerCounterState, setLayerCounterState] = useState(0);



  //Verificar si


  let center: LngLatLike | undefined;
  let lat: number;
  let lng: number;
  // Estado para controlar la carga
  const [loading, setLoading] = useState(true);

  if (responseValue?.ubicacion) {
    const [lngValue, latValue] = responseValue.ubicacion;
    center = new LngLat(lngValue, latValue);
    lat = center.lat;
    lng = center.lng;
  }

  const solicitud = async (data: any) => {
    const categories = responseValue?.selectedCategories ?? [];
    const result = await setPois(categories, lat, lng);
    console.log("res",result);
    console.log("categorias",categories);
    console.log(randomPois,user, data, decodedToken);

  };

  const fetchData = async () => {
    const categories = responseValue?.selectedCategories ?? [];
    const result = await setPois(categories, lat, lng);
    setPuntosInteres(result);

    generateRandomPois();
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

    fetchData();
  }, []);

  useEffect(() => {
    if (pois.length > 0) {
      generateRandomPois();
    }
  }, [pois]);


  const handleSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    solicitud(data);
  };

  useLayoutEffect(() => {
    const newMarkers: Marker[] = [];
  
    try {
      if (responseValue && mapDiv.current) { // Verificar si mapDiv.current existe
        const map = new Map({
          container: mapDiv.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          center: center,
          zoom: 14
        });
  
        if (map) {
          map.flyTo({
            zoom: 12.5,
            center: center
          });
          const myLocationPopup = new Popup().setHTML(
            `
                <h2>Mi ubicacion</h2>
                <p>Aquí comienza su ruta turistica</p>
                `
          );
          if (lat !== undefined && lng !== undefined) {
            const newMarker = new Marker({
              color: "#E74C3C"
            })
              .setLngLat([lng, lat])
              .setPopup(myLocationPopup)
              .addTo(map);
            newMarkers.push(newMarker);
          }

          setMap(map);
  
        } else {
          throw new Error("El mapa no está listo o existe un error");
        }
      }
      } catch (error) {
        console.error("Ha ocurrido un error", error);
      }
    
      if (map) {
        setLoading(false);
      }
    }, [poi]);


  const generateRandomPoisForDay = async (): Promise<any[]> => {
    const [hoursS, minutesS] = (responseValue?.horaI ?? "").split(":").map((num) => parseInt(num)) || [0, 0];
    const startMinutes = hoursS * 60 + minutesS;
    const [hoursE, minutesE] = (responseValue?.horaF ?? "").split(":").map((num) => parseInt(num)) || [0, 0];
    const endMinutes = hoursE * 60 + minutesE;
  
    const selectedPoisWithTime: any[] = [];
    let remainingTime = endMinutes - startMinutes;
    const poisForDay = [...pois]; // Copiar la lista de puntos de interés disponibles
    let currentMinutes = startMinutes; // Hora actual que se irá aumentando
  
    while (remainingTime >= 60 && poisForDay.length > 0) {
      const poiIndex = Math.floor(Math.random() * poisForDay.length);
      const poiObj:Result = poisForDay[poiIndex];
  
      const type = poiObj.types[0]; // Obtener el primer tipo de lugar

      const category = tiposAtractivosTuristicos.find((cat) => cat.type === type); // Buscar la categoría en base al tipo
      const poiTime = category?.duration || 60; // Utilizar la duración de la categoría o un tiempo fijo de 60 minutos si no se encuentra la categoría
  
      selectedPoisWithTime.push({
        poiObj,
        time: poiTime,
        startTime: currentMinutes // Guardar la hora de inicio
      });
  
      remainingTime -= poiTime;
      poisForDay.splice(poiIndex, 1);
      currentMinutes += poiTime; // Aumentar la hora actual
    }
  
    if (remainingTime > 0 && poisForDay.length > 0) {
      poisForDay.forEach((poiObj) => {
        if (remainingTime <= 0) {
          return;
        }
  
        const type = poiObj.types[0]; // Obtener el primer tipo de lugar
        const category = tiposAtractivosTuristicos.find((cat) => cat.type === type); // Buscar la categoría en base al tipo
        const poiTime = category?.duration || 60; // Utilizar la duración de la categoría o un tiempo fijo de 60 minutos si no se encuentra la categoría
  
        selectedPoisWithTime.push({
          poiObj,
          time: poiTime,
          startTime: currentMinutes // Guardar la hora de inicio
        });
  
        remainingTime -= poiTime;
        currentMinutes += poiTime; // Aumentar la hora actual
      });
    }
  
    return selectedPoisWithTime;
  };
  

  const generateRandomPois = async () => {
    const days = responseValue?.dias || 0;
    const dateStart = responseValue?.fecha || 0;

    const newRandomPois: any[] = [];

    for (let i = 1; i <= days; i++) {
      const poiforday = await generateRandomPoisForDay();

      const date = new Date(dateStart);
      date.setDate(date.getDate() + i - 1);
      const index = i - 1;

      newRandomPois.push({
        numberday: i,
        dateStart: date.toISOString().slice(0, 10),
        poi: poiforday,
        index
      });
    }

    setRandomPois(newRandomPois);
  };



  /* TODO: GENERAR RUTAS */
  let layerCounter = layerCounterState;
  const GenerateItineraryDay = (numberDay: number) => {

    const day = Number(numberDay - 1);
    if (randomPois && randomPois.length > 0) {
      createdMarkers.forEach(marker => {
        marker.remove();
      });

      map?.getStyle().layers.forEach(layer => {
        if (layer.type === "line" && layer.id.startsWith("RouteString")) {
          map?.removeLayer(layer.id);
        }
      });
      const newMarkers: Marker[] = [];
      let [Startlat, Startlng]: [number, number] = responseValue?.ubicacion || [0, 0];
      console.log("hola", Startlng, Startlat)
      GenerateItinerary(randomPois, day, newMarkers, [Startlng, Startlat]);
      setLayerCounterState(layerCounterState + randomPois[day].poi.length + 1);
      [Startlat, Startlng] = responseValue?.ubicacion || [0, 0];
    }
  };

  /* TODO: GENERAR  ITINERARIO*/
  const GenerateItinerary = (randomPois: any[], day: number, newMarkers: Marker[], start: [number, number]) => {
    const [Startlat, Startlng] = start;
    if (!map) {
      return;
    }
    const coords = [{ lat: Startlat, lng: Startlng }];

    for (let i = 0; i < randomPois[day].poi.length; i++) {
      const lat = randomPois[day].poi[i].poiObj?.geometry?.location.lat;
      const lng = randomPois[day].poi[i].poiObj?.geometry?.location.lng;
      const poiCoord = { lat, lng };
      coords.push(poiCoord);
      const popup = new Popup().setHTML(`
        <h2>${randomPois[day].poi[i].poiObj?.name}</h2>
        <p>${randomPois[day].poi[i].poiObj?.vicinity}</p>
      `);
      const newMarker = new Marker().setPopup(popup).setLngLat([lng, lat]).addTo(map);
      newMarkers.push(newMarker);
    }
    const lastPoiCoord = coords[coords.length - 1];
    coords.push(lastPoiCoord); // Regresar al punto de inicio
    for (let i = 0; i < coords.length - 1; i++) {
      getRouteBetweenPoints([coords[i].lng, coords[i].lat], [coords[i + 1].lng, coords[i + 1].lat]);
    }
    setCreatedMarkers(newMarkers);
  };

  const getRouteBetweenPoints = async (start: [number, number], end: [number, number]) => {

    const resp = await directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
    const { distance/*, duration*/, geometry } = resp.data.routes[0];
    const { coordinates: coords } = geometry;
    let kms = distance / 100;
    kms = Math.round(kms * 100);
    kms /= 100;
    //    const minutes = Math.floor(duration / 60);

    const bounds = new LngLatBounds(
      start,
      end
    );

    for (const coord of coords) {
      // Verificar si las coordenadas son números válidos
      if (typeof coord[0] === 'number' && typeof coord[1] === 'number' && !isNaN(coord[0]) && !isNaN(coord[1])) {
        const newCoord: [number, number] = [coord[0], coord[1]];
        bounds.extend(newCoord);
      } else {
        // Manejar el caso en el que las coordenadas no sean válidas
        console.error('Coordenadas no válidas:', coord);
      }
    }

    //   map?.fitBounds(bounds, {
    //    padding: 200
    //  });
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature', properties: {}, geometry: {
              type: 'LineString', coordinates: coords
            }
          }
        ]
      }
    }

    const layerId = `RouteString-${layerCounter++}`;
    map?.addSource(layerId, sourceData);
    map?.addLayer({
      id: layerId,
      type: 'line',
      source: layerId,
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'hsl(210, 87%, 57%)',
        'line-width': 3
      }

    })
  }



  const [selectedDay, setSelectedDay] = useState(0);

  const handleSelectDay = (event: any) => {
    setSelectedDay(event.target.value);
    GenerateItineraryDay(parseInt(event.target.value));
  };

  const dias = responseValue?.dias;
  function renderStars(rating: number) {
    const fullStars = Math.floor(rating);
    const stars = [];
  
    if (!rating) {
      stars.push(
        <StarIcon key="empty-star-1" style={{ fontSize: '16px' }} />,
        <StarIcon key="empty-star-2" style={{ fontSize: '16px' }} />,
        <StarIcon key="empty-star-3" style={{ fontSize: '16px' }} />,
        <StarIcon key="empty-star-4" style={{ fontSize: '16px' }} />,
        <StarIcon key="empty-star-5" style={{ fontSize: '16px' }} />
      );
    }
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} style={{ color: 'gold', fontSize: '16px' }} />);
    }
    for (let i = fullStars; i < 5; i++) {
      stars.push(<StarIcon key={`empty-star-${i}`} style={{ fontSize: '16px' }} />);
    }
    return stars;
  }
  

  const theme = useTheme();

  const [selectedPoiIndex, setSelectedPoiIndex] = useState<number>(-1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handlePoiChange = (index: number) => {
    setSelectedPoiIndex(index);
    setModalOpen(true);
  };

  const handleModalClose = (day: number) => {
    if (selectedPoiIndex !== -1) {
      const newRandomPois = [...randomPois];
      const selectedPoi = pois[selectedPoiIndex];
      const selectedPoiObj = newRandomPois[day].poi[selectedPoiIndex];
      selectedPoiObj.poiObj = selectedPoi;
      setRandomPois(newRandomPois);
    }
    setSelectedPoiIndex(-1);
    setModalOpen(false);
  };


  return (
    <>
      {loading ? ( // Si loading es verdadero, mostramos la pantalla de carga
        <LoadingScreen />
      ) : ( // Si loading es falso, mostramos el contenido normal del componente
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
              spacing={1}
            >
              <Grid item xs={12} sm={5}>
                <Card>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "50ch" }
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    {dias && (
                      <TextField
                        id="standard-select-day"
                        select
                        label="Seleccione día"
                        value={selectedDay}
                        onChange={handleSelectDay}
                        variant="standard"
                      >
                        {selectedDay === 0 && (
                          <MenuItem value={0}>Seleccione día</MenuItem>
                        )}
                        {Array.from({ length: dias }).map((_, i) => (
                          <MenuItem key={i} value={i + 1}>
                            Día {i + 1}
                          </MenuItem>
                        ))}
                      </TextField>

                    )}
                  </Box>
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
                      <div
                        ref={mapDiv}
                        style={{
                          height: "70vh",
                          width: "100%"
                        }}
                      ></div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={15}>
                <Card>
                  <CardHeader
                    title={
                      <Typography variant="h4" align="center">
                        Itinerario
                      </Typography>
                    }
                  />
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
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>

                              <TableCell>Fecha</TableCell>
                              <TableCell>Hora</TableCell>
                              <TableCell>Lugar</TableCell>
                              <TableCell>Puntucación</TableCell>
                              <TableCell>Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {randomPois?.map((item?: any) => (
                              <React.Fragment key={item.numberday}>
                                <TableRow hover>

                                  <TableCell rowSpan={item.poi.length + 1}>
                                    <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      Dia {item.numberday}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                      {format(parseISO(item.dateStart), 'MMMM dd yyyy')}
                                    </Typography>
                                  </TableCell>

                                </TableRow>
                                {item.poi.slice(0).map((poi: any, index: number) => (
                                  <TableRow key={`${item.numberday}-${index}`}>
                                    <TableCell>
                                      <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="text.primary"
                                        gutterBottom
                                        noWrap
                                      >
                                   {format(addMinutes(parseISO(item.dateStart), poi.startTime), 'hh:mm a')}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                        color="text.primary"
                                        gutterBottom
                                        noWrap
                                      >
                                        {poi.poiObj?.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" noWrap>
                                        {poi.poiObj?.vicinity}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      {renderStars(poi.poiObj?.rating)}
                                    </TableCell>
                                    <TableCell align="left">
                                          <ModalCalificacion poi={poi} />
                                      <Tooltip title="Cambie el lugar" arrow>
                                        <IconButton
                                          sx={{
                                            '&:hover': { background: theme.colors.error.lighter },
                                            color: theme.palette.warning.main
                                          }}
                                          onClick={() => handlePoiChange(index)}
                                          color="inherit"
                                          size="small"
                                        >
                                          <ChangeCircleIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Dirección" arrow>
                                        <IconButton
                                          sx={{
                                            '&:hover': { background: theme.colors.error.lighter },
                                            color: theme.palette.error.main
                                          }}
                                          onClick={() => handlePoiChange(index)}
                                          color="inherit"
                                          size="small"
                                        >
                                          <NotListedLocationIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                    
                                  </TableRow>
                                ))}
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                        +Guardar
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
          <Modal open={modalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: 500,
            maxHeight: 500,
            overflow: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Seleccione un POI
          </Typography>
          <List>
            {pois.map((poi: Result, index: number) => (
              <ListItem
                key={poi.place_id}
                button
                selected={index === selectedPoiIndex}
                onClick={() => setSelectedPoiIndex(index)}
              >
                <ListItemText primary={poi.name} secondary={poi.types[0]} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" onClick={() => handleModalClose(selectedPoiIndex)}>
          Cerrar
        </Button>
        </Box>
      </Modal>
        </>
      )}

    </>
  );
};

export default Itinerario;
