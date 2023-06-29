import axios from "axios";
const directionsApi = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    params:{
        alternatives:false,
        geometries:'geojson',
        language: 'es',
        overview:'simplified',
        steps:false,
        access_token: 'pk.eyJ1IjoiamVzdXNybTAxIiwiYSI6ImNsZGYybDM1azBqaTEzd3I4d2dyYzAxM3AifQ.9cIHabSjoqi5B9cUVusrWw'
    }
})

export default directionsApi;