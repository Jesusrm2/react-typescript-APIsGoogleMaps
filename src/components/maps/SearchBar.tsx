

import { ChangeEvent, useContext, useRef } from "react"
import { PlacesContext } from "../../contexts/places/PlacesContext";
import { SearchResults } from "./SearchResults";




export const SearchBar = () => {

    const {searchPlacesByTerm} = useContext(PlacesContext);

    //Si la persona deja de escribir se ejecutara esta funcion 
    const debounceRef = useRef<NodeJS.Timeout>()
    const onQueryChanged = (event:ChangeEvent<HTMLInputElement>) =>{
        if (debounceRef.current)
            clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            searchPlacesByTerm(event.target.value)
        }, 350);
        
    }

    return (
        <div style={{
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
            left: "20px",
            padding: "5px",
            top: "63%",
            width: "250px",
            zIndex: 999
          }}>
          
            <input type="text" 
            className="form-control"
            placeholder="Buscar lugar...."
            onChange={onQueryChanged}
            />
            <SearchResults/>
        </div>
    )
}
