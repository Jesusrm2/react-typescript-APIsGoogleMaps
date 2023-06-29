import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "mapbox-gl";
import { useReducer, useContext, useEffect } from "react";



import { MapContext } from "./MapConetxt";
import { mapReducer } from "./mapReducer";
import directionsApi from "../../api/directions";
import { DirenctionsResponse } from "../../interfaces/directions";
import { PlacesContext } from "../places/PlacesContext";


export interface MapState{
    isMapReady: boolean;
    map?:Map,
    markers: Marker[];
}

const INITIAL_STATE: MapState = {
    isMapReady: false,
    map: undefined,
    markers:[],
}

interface Props{
    children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({children}:Props) => {

    const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);

    const {places} = useContext(PlacesContext);
    useEffect(() => {
        state.markers.forEach(marker => marker.remove());
        const newMarkers: Marker[] =[];

        for (const place of places) {
            const [ lng, lat ] = place.center;
            const popup = new Popup()
                .setHTML(`
                    <h6>${place.text}</h6>
                    <p>${place.place_name}</p>
                `);
            const newMarker = new Marker()
                .setPopup(popup)
                .setLngLat([lng,lat])
                .addTo(state.map!);
            newMarkers.push(newMarker);
        }

        //Limpiar polyline
        dispatch({type:' setMarkers',payload: newMarkers});

    }, [places])
    

    const setMap =(map: Map) =>{

        const myLocationPopup = new Popup()
            .setHTML(
                `
                <h4>Aqui estoy</h4>
                <p>En algún lugar del mundo</p>
                `
            )

        //Maracador
        new Marker({
            color:'#E74C3C'
        })
            .setLngLat(map.getCenter())
            .setPopup(myLocationPopup)
            .addTo(map);

        dispatch({type: 'setMap', payload: map})
    }

    const getRouteBetweenPoints =async (start:[number, number], end: [number, number]) => {
        const resp = await directionsApi.get<DirenctionsResponse>(`/${start.join(',')};${end.join(',')}`)
        const {distance, duration, geometry}= resp.data.routes[0];
        const {coordinates:coords} = geometry;


        let kms = distance / 100;
            kms = Math.round(kms * 100);
            kms /= 100;

        const minutes = Math.floor(duration/60);
        console.log({kms, minutes});


        const bounds = new LngLatBounds(
            start,
            start
        );

        for (const coord of coords) {
            const newCoord: [number , number]= [coord[0], coord[1]];
            bounds.extend(newCoord);
        }

        state.map?.fitBounds(bounds,{
            padding: 200
        });

        //PolyLine
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
        }
        if ( state.map?.getLayer('RouteString') ) {
            state.map.removeLayer('RouteString');
            state.map.removeSource('RouteString');
        }

        // TODO remover polyline
        state.map?.addSource('RouteString', sourceData);
        state.map?.addLayer({
            id: 'RouteString',
            type: 'line',
            source: 'RouteString',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'white',
                'line-width': 3
            }

        })
    }
    return (
        <MapContext.Provider value ={{
            ...state,
            getRouteBetweenPoints,
            setMap,
        }}>
            {children}
        </MapContext.Provider>
    )
}






