import axios from "axios";

const poiApi = axios.create({
    baseURL: '/maps/api/place/nearbysearch',
    params:{
    radius: 5000,
     key: 'api_key',//api key google maps
    }
    });

export default poiApi;
