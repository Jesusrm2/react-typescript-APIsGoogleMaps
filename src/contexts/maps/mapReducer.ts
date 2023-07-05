import { MapState } from "./MapProvider";
import { Map, Marker } from "mapbox-gl";

type MapAction = 
|{ type: 'setMap', payload: Map}
|{ type:' setMarkers', payload: Marker[]}
|{type:'setPois', payload: any[]}
export const mapReducer =(state: MapState, action: MapAction):MapState =>{
    switch (action.type) {
        case 'setMap':
            return {
                ...state,
                isMapReady: true,
                map: action.payload
            }
        case ' setMarkers':
            return{
                ...state,
                markers: action.payload
            }
            case 'setPois':
                return{
                        ...state,
                        poi:action.payload
                }
    
        default:
           return state;
    }
}