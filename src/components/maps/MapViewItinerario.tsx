import React, { useEffect, useRef } from 'react';
import mapboxgl, { LngLatLike, Map, Marker, Popup } from 'mapbox-gl';

type MapViewProps = {
  center: LngLatLike | undefined;
};

const MapView: React.FC<MapViewProps> = ({ center }) => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const markers = useRef<Marker[]>([]);

  useEffect(() => {
    if (center) {
      map.current = new mapboxgl.Map({
        container: mapDiv.current!,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: center,
        zoom: 14,
      });

      const myLocationPopup = new Popup().setHTML(`
      <h2>Mi ubicacion</h2>
      <p>Aquí comienza su ruta turistica</p>
      `);

      const marker = new Marker({ color: '#E74C3C' })
        .setLngLat(center)
        .setPopup(myLocationPopup)
        .addTo(map.current);

      markers.current.push(marker);

      map.current.flyTo({ zoom: 14, center: center });
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [center]);

  return <div ref={mapDiv} style={{ width: '100%', height: '400px' }} />;
};

export default MapView;
