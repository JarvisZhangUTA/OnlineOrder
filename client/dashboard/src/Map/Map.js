import React from "react"
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC2Ztx8C1ivnxS6wV_xcqzfpxqKVO1suc4&v=3.exp&language=en&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `200px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: +props.lat, lng: +props.lng }}
  >
    <Marker position={{ lat: +props.lat, lng: +props.lng }} onClick={props.onMarkerClick} />
  </GoogleMap>
));

export default Map;
