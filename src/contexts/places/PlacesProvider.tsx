import { useEffect,useReducer } from "react";


import { IFormInput } from "../../interfaces/form";
import { Feature, PlacesResponse } from "../../interfaces/places";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./PlacesReducer";
import { getUserLocation } from "../../helpers/getUserLocation";
import searchApi from "../../api/searchApi";

export interface PlacesState{
    isLoading: boolean;
    userLocation?: [number, number];
    isLoadingPlaces: boolean;
    places: Feature[];
    userInformation: IFormInput[];
    
}

const INITIAL_STATE: PlacesState = {
    isLoading: true,
    userLocation: undefined,
    isLoadingPlaces: false,
    places:[],
    userInformation:[]
}

interface Props{
    children: JSX.Element | JSX.Element[]
}

export const PlacesProvider = ({children}:Props) => {

  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  //Obtener geolocalizacion de la persona 
  useEffect(() => {
    getUserLocation()
        .then(lngLat => dispatch({type: 'setUserLocation', payload:lngLat}))
  }, [])
  
  const searchPlacesByTerm = async(query:string):Promise<Feature[]>=>{
    if (query.length === 0){
      dispatch({type: 'setPlaces', payload:[]})
      return [];
    }
    if (!state.userLocation) throw new Error('No hay ubicacion del usuario');

    dispatch({type: 'isLoadingPlaces'});
    
    const resp = await searchApi.get<PlacesResponse>(`/${query}.json`,{
      params:{
        proximity: state.userLocation.join(',')
      }
    });
    dispatch({type:'setPlaces', payload:resp.data.features});
    return resp.data.features;
  }


  return (
    <PlacesContext.Provider value={{
       ...state, 
       searchPlacesByTerm,

    }}>
    {children}
    </PlacesContext.Provider>
  )
}
