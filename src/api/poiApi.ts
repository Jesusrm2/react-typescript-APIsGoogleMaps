import axios from "axios";

const poiApi = axios.create({
    baseURL: '/maps/api/place/nearbysearch',
    params:{
    radius: 5000,
    key: 'AIzaSyC4i2ej2NQxOwvw9hpGkTZVpADP8FYAuKk'
    }
    });

export default poiApi;