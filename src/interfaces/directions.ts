export interface DirectionsResponse{
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}

interface Route {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: Leg[];
  geometry: Geometry;
}

interface Geometry {
  coordinates: number[][];
  type: string;
}

interface Leg {
  via_waypoints: any[];
  admins: Admin[];
  weight: number;
  duration: number;
  steps: any[];
  distance: number;
  summary: string;
}

interface Admin {
  iso_3166_1_alpha3: string;
  iso_3166_1: string;
}