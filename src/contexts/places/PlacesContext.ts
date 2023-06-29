import { createContext } from 'react';
import { IFormInput } from '../../interfaces/form';
import { Feature } from '../../interfaces/places';


export interface PlacesContextProps{
    isLoading: Boolean;
    userLocation?: [number, number];
    isLoadingPlaces: boolean;
    places: Feature[];
    userInformation: IFormInput[];


    //metodos
    searchPlacesByTerm: (query: string) => Promise<Feature[]>;

}

export const PlacesContext = createContext<PlacesContextProps>({

} as PlacesContextProps);