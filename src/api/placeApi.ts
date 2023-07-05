import axios from "axios";

const placeApi = axios.create({
    baseURL: '/maps/api/place/details',
    params:{
    key: 'AIzaSyC4i2ej2NQxOwvw9hpGkTZVpADP8FYAuKk',
    fields:'name,opening_hours,business_status,vicinity,formatted_phone_number'
    
}
});

export default placeApi;