import { useState, useContext } from 'react';
import { Modal, Box, Grid, Tooltip, IconButton, useTheme, Container, Card, Divider, CardHeader, Typography } from '@mui/material';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import PlaceIcon from '@mui/icons-material/Place';
import MapIcon from '@mui/icons-material/Map';
import { IPiDia } from '../../interfaces/tipos-lugares';
import { MapViewDirecciones } from '../maps/MapViewDireccion';
import { MapContext } from '../../contexts/maps/MapConetxt';
import CancelIcon from '@mui/icons-material/Cancel';
import { AnySourceData, LngLatBounds, Marker, Popup } from 'mapbox-gl';
import { PlacesContext } from '../../contexts/places/PlacesContext';
import directionsApi from '../../api/directions';
import { DirectionsResponse } from '../../interfaces/directions';

interface ModalCalificacionProps {
  poi: IPiDia;
  lat: number;
  lng: number;
}

const ModalDireccion = ({ poi, lat, lng }: ModalCalificacionProps) => {
  const { userLocation } = useContext(PlacesContext);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { mapDir } = useContext(MapContext);
  const [createdMarkers, setCreatedMarkers] = useState<Marker[]>([]);
  const [layerCounterState, setLayerCounterState] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [kilometros, setKilometros] = useState(0);

  const handleRate = () => {
    console.log('Ubicando lugar:', poi.poiObj.geometry.location);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMinutos(0);
    setKilometros(0);
  };

  const ubicacionActual = () => {
    if (mapDir) {
      clearMap();
      const newMarkers: Marker[] = [];
      const popup = createPopup(poi.poiObj.name, poi.poiObj.vicinity);
      const newMarker = createMarker([poi.poiObj.geometry.location.lng, poi.poiObj.geometry.location.lat], popup);
      if(newMarker){
        newMarkers.push(newMarker);
      }

      if (userLocation) {
        const popup2 = createPopup('Partida');
        const newMarker2 = createMarker([userLocation[0], userLocation[1]], popup2, "#E74C3C");
        if(newMarker2){
            newMarkers.push(newMarker2);
          }
        getRouteBetweenPoints([userLocation[0], userLocation[1]], [poi.poiObj.geometry.location.lng, poi.poiObj.geometry.location.lat]);
      }
      
      setCreatedMarkers(newMarkers);
      setLayerCounterState(layerCounterState + 1);
    }
  };

  const ubicacionEscogida = () => {
    if (mapDir) {
      clearMap();
      const newMarkers: Marker[] = [];
      const popup = createPopup(poi.poiObj.name, poi.poiObj.vicinity);
      const newMarker = createMarker([poi.poiObj.geometry.location.lng, poi.poiObj.geometry.location.lat], popup);
      if(newMarker){
        newMarkers.push(newMarker);
      }
      const popup2 = createPopup('Partida');
      const newMarker2 = createMarker([lng, lat], popup2, "#E74C3C");
      
      if(newMarker2){
        newMarkers.push(newMarker2);
      }
     
      getRouteBetweenPoints([lng, lat], [poi.poiObj.geometry.location.lng, poi.poiObj.geometry.location.lat]);

      setCreatedMarkers(newMarkers);
      setLayerCounterState(layerCounterState + 1);
    }
  };

  const clearMap = () => {
    createdMarkers.forEach(marker => {
      marker.remove();
    });
    mapDir?.getStyle().layers.forEach(layer => {
      if (layer.type === "line" && layer.id.startsWith("RouteString")) {
        mapDir.removeLayer(layer.id);
      }
    });
  };

  const createPopup = (title: string, text?: string) => {
    let content = `<h2>${title}</h2>`;
    if (text) {
      content += `<p>${text}</p>`;
    }
    return new Popup().setHTML(content);
  };

  const createMarker = (lngLat: [number, number], popup: Popup, color?: string) => {
    if(mapDir){
        let markerOptions = {};
        if (color) {
          markerOptions = { color };
        }
        return new Marker(markerOptions).setPopup(popup).setLngLat(lngLat).addTo(mapDir);
    }
   
  };

  const getRouteBetweenPoints = async (start: [number, number], end: [number, number]) => {
    const resp = await directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`);
    const { distance, duration, geometry } = resp.data.routes[0];
    const { coordinates: coords } = geometry;
    const minutes = Math.floor(duration / 60);

    let kms = distance / 100;
    kms = Math.round(kms * 100);
    kms /= 100;

    setMinutos(minutes);
    setKilometros(kms);

    const bounds = new LngLatBounds(start, end);
    for (const coord of coords) {
      if (typeof coord[0] === 'number' && typeof coord[1] === 'number' && !isNaN(coord[0]) && !isNaN(coord[1])) {
        bounds.extend(coord as [number, number]);
      } else {
        console.error('Coordenadas no válidas:', coord);
      }
    }

    mapDir?.fitBounds(bounds, {
      padding: 100
    });

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    };

    const layerId = `RouteString-${layerCounterState}`;
    mapDir?.addSource(layerId, sourceData);
    mapDir?.addLayer({
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
    });
  };

  return (
    <>
      <Tooltip title="Dirección" arrow>
        <IconButton
          onClick={handleRate}
          sx={{
            '&:hover': { background: theme.colors.error.lighter },
            color: theme.palette.error.main
          }}
          color="inherit"
          size="small"
        >
          <NotListedLocationIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={100} sm={10}>
              <Card>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardHeader title="Ver ruta desde su ubicación actual o la que marcó" />
                  <div>
                    <Tooltip title="Ubicación actual" arrow>
                      <IconButton
                        onClick={ubicacionActual}
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.secondary.light,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <PlaceIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Punto de partida" arrow>
                      <IconButton
                        onClick={ubicacionEscogida}
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.secondary.light,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <MapIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cerrar" arrow>
                      <IconButton
                        onClick={handleClose}
                        sx={{
                          "&:hover": {
                            background: theme.colors.primary.lighter,
                          },
                          color: theme.palette.error.light,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Box>
                <Divider />
                <Box>
                  <MapViewDirecciones />
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      Distancia:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {kilometros} kilómetros
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" fontWeight="bold" color="text.primary" gutterBottom noWrap>
                      Minutos:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {minutos} min
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Modal>
    </>
  );
};

export default ModalDireccion;