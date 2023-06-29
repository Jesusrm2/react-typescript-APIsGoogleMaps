import axios from "axios";
const searchApi = axios.create({
    baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    params:{
        limit: 5,
        language: 'es',
        access_token: 'pk.eyJ1IjoiamVzdXNybTAxIiwiYSI6ImNsZGYybDM1azBqaTEzd3I4d2dyYzAxM3AifQ.9cIHabSjoqi5B9cUVusrWw'
    }
})

export default searchApi;