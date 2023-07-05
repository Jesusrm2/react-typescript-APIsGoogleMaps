import { createContext } from "react";
import { Map } from "mapbox-gl";
import { Result } from "../../interfaces/poi";
import { Category } from "../../interfaces/tipos-lugares";


interface MapContextProps{
    isMapReady: boolean;
    map?:Map,
    poi:Result[];
    //metodos
    
    getRouteBetweenPoints: (start:[number, number], end: [number, number]) => Promise<void>;
    setPois: (PointOfInterest:Category[], lat: number, long:number)=> Promise<any[]>;
    setMap: (map: Map) => void;
}


export const MapContext = createContext({}as MapContextProps)