import React, { createContext, useContext } from "react";
import { Map } from "mapbox-gl";

interface MapContextValue {
  map: Map | null;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext debe ser utilizado dentro de MapProvider");
  }
  return context;
};

interface MapProviderProps {
  children: React.ReactNode;
  map: Map | null;
}

export const MapProvider = ({ children, map }: MapProviderProps) => {
  return (
    <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
  );
};
