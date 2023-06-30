
import { useContext, useState } from "react"
import { PlacesContext } from "../../contexts/places/PlacesContext";
import { MapContext } from "../../contexts/maps/MapConetxt";
import { Feature } from "../../interfaces/places";
import { LoadingPlaces } from "./LoadingPlaces";



export const SearchResults = () => {
    const {places, isLoadingPlaces, userLocation} = useContext(PlacesContext);

    const{map, getRouteBetweenPoints} = useContext(MapContext);

    const [activeId, setActiveId] = useState('');

    


    const onPlaceClicked = async (place:Feature) =>{
        setActiveId(place.id);
        const[lng, lat] = place.center;
        map?.flyTo({
            zoom: 14,
            center:[lng, lat]
        })
        console.log(userLocation);


    }
    const getRoute = (place: Feature) =>{

        if(!userLocation) return;

        const [lng, lat] = place.center;

        getRouteBetweenPoints(userLocation, [lng, lat]);
    }

    if(isLoadingPlaces){
        return <LoadingPlaces/>;
    }

    if(places.length === 0){
        return <></>;
    }

  return (
    <ul className="list-group mt-3">
        {
            places.map(place =>(
                <li 
                key={place.id} 
                className={`list-group-item list-group-item-action pointer ${(activeId === place.id) ? 'active': ''}`}
                onClick={() => onPlaceClicked(place)}
                >
                    <h6>{place.text}</h6>
                    <p 
                    style={{
                        fontSize: '12px',
                    }}>
                        {place.place_name}
                    </p>`
                    <button 
                    onClick={() => getRoute(place)}
                    className={`btn btn-sm ${ activeId === place.id ? 'btn-outline-light':'btn-outline-primary'}`}>
                        Direcciones
                    </button>
                </li>
            ))
        }

        
    </ul>
  )
}
