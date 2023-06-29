import { PlacesState } from "./PlacesProvider";
import { Feature} from "../../interfaces/places";
import { IFormInput } from "../../interfaces/form";

type PlacesAction = 
| {type:'setUserLocation', payload: [number, number]}
| {type:'isLoadingPlaces'}
| {type:'setPlaces', payload: Feature[]}
| {type:'setUserInformation', payload: IFormInput[]}


export const placesReducer = (state: PlacesState, action:PlacesAction ): PlacesState => {
    switch (action.type) {
        case 'setUserLocation':
            
            return{
                ...state,
                isLoading: false,
                userLocation: action. payload
            }
        case 'isLoadingPlaces':
            return{
                ...state,
                isLoadingPlaces: true,
                places: [],
            }
        case 'setPlaces':
            return{
                ...state,
                isLoadingPlaces: false,
                places: action.payload
            }
        case 'setUserInformation':
            return{
                ...state,
                isLoadingPlaces: true,
                userInformation: action.payload,
            }   
        default:
            return state;
    }
}