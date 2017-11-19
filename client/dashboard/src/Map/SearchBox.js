import React from "react"
import {compose, withProps, lifecycle} from "recompose";
import {withScriptjs} from "react-google-maps";
import {StandaloneSearchBox} from "react-google-maps/lib/components/places/StandaloneSearchBox";

const SearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyC2Ztx8C1ivnxS6wV_xcqzfpxqKVO1suc4&v=3.exp&language=en&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.props.onAddressChanged({
            address: places[0].formatted_address,
            lat: places[0].geometry.location.lat(),
            lng: places[0].geometry.location.lng()
          });
        },
      })
    },
  }),
  withScriptjs  
)(props =>
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Address"
        className="validate"
        onChange={props.onAddressWillChange}
        value={props.address}
      />
    </StandaloneSearchBox>
  </div>
);

export default SearchBox;