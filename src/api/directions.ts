import axios from "axios";
const directionsApi = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    params:{
        alternatives:false,
        geometries:'geojson',
        language: 'es',
        overview:'simplified',
        steps:false,
        access_token: 'your_apikey' //Api key google maps
    }
})

export default directionsApi;
