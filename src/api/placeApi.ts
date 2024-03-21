import axios from "axios";

const placeApi = axios.create({
    baseURL: '/maps/api/place/details',
    params:{
    key: 'api_key',//api key google maps
    fields:'name,opening_hours,business_status,vicinity,formatted_phone_number'
    
}
});

export default placeApi;
