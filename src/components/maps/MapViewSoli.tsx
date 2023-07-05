import { useContext, useLayoutEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Map } from "mapbox-gl";
import { PlacesContext } from "../../contexts/places/PlacesContext";
import { Loading } from "./Loading";
import { MapContext } from "../../contexts/maps/MapConetxt";

export const MapView = ({ onLocationClick }: { onLocationClick: (location: number[]) => void }) => {
  const { isLoading, userLocation } = useContext(PlacesContext);
  const { setMap } = useContext(MapContext);
  const mapDiv = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null); // Referencia al marcador creado

  useLayoutEffect(() => {
    if (!isLoading) {
      const map = new Map({
        container: mapDiv.current!, // ID del contenedor
        style: "mapbox://styles/mapbox/outdoors-v12", // URL del estilo
        center: userLocation, // Posición inicial [lng, lat]
        zoom: 14, // Zoom inicial
      });

      map.on("click", (e) => {
        const clickedLocation = [e.lngLat.lng, e.lngLat.lat];
        console.log("Clicked Location:", clickedLocation);

        const popup = new mapboxgl.Popup().setHTML(`
            <h4>Ubicación Marcada</h4>
            <p>Latitud: ${clickedLocation[1]}</p>
            <p>Longitud: ${clickedLocation[0]}</p>
          `);

        // Eliminar el marcador anterior si existe
        if (markerRef.current) {
          markerRef.current.remove();
        }

        const marker = new mapboxgl.Marker({
          color: "#61DAFB",
        })
          .setLngLat(clickedLocation as mapboxgl.LngLatLike)
          .setPopup(popup)
          .addTo(map);

        markerRef.current = marker;
        onLocationClick(clickedLocation);
      });
      setMap(map);
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      ref={mapDiv}
      style={{
        height: "70vh",
        width: "100%",
      }}
    >
      {userLocation?.join(",")}
    </div>
  );
};
