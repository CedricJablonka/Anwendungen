import {
  FETCH_STREET_DATA,
  CHANGE_HIGHWAY_TYPE_SELECTION,
  UPDATE_OVERPASS_QUERY,
  CHANGE_IS_LOADING_STREET_DATA,
  CHANGE_USER_LOCATION_INFO,
  CHANGE_STREET_CLICKED_POSITION,
  CHANGE_SHOW_STREET_DETAIL_INFORMATION,
  CHANGE_STREET_DETAILS_DATA,
  CHANGE_IS_LOADING_STREET_DETAILS_DATA,
  CHANGE_ALL_EDITED_STREETS_WITHIN_CITY,
  ADD_GEO_JSON_REF,
  CHANGE_GEO_JSON_COLOR_MAP
} from "../types";

const GeneralReducer = (prevState, { type, payload }) => {
  switch (type) {
    case CHANGE_IS_LOADING_STREET_DATA:
      return {
        ...prevState,
        isLoadingStreetData: !prevState.isLoadingStreetData,
      };
    case FETCH_STREET_DATA:
      return {
        ...prevState,
        streetData: payload,
        isLoadingStreetData: false,
      };
    case CHANGE_HIGHWAY_TYPE_SELECTION:
      //payload is an object that holds the name of the selected highway type

      //make a copy of overpass highwaytypes object
      let tmp = { ...prevState.overpassHighwayTypes };

      //inverse the current active status of the clicked highway type
      tmp[payload.highwayType].active = !tmp[payload.highwayType].active;

      //exchange the highwaytypes object with the created copy
      return {
        ...prevState,
        overpassHighwayTypes: tmp,
      };
    // This is merely an example. wouldn't be here for long
    case CHANGE_USER_LOCATION_INFO:
      return {
        ...prevState,
        userLocationInfo: payload,
      };

    case CHANGE_SHOW_STREET_DETAIL_INFORMATION:
      return {
        ...prevState,
        showStreetDetailInformation: payload,
      };

    case CHANGE_STREET_CLICKED_POSITION:
      return {
        ...prevState,
        streetClickedPosition: payload,
      };

    case CHANGE_STREET_DETAILS_DATA:
      return {
        ...prevState,
        streetDetailsData: payload,
      };

    case CHANGE_IS_LOADING_STREET_DETAILS_DATA:
      return {
        ...prevState,
        isLoadingStreetDetailsData: payload,
      };

    case UPDATE_OVERPASS_QUERY:
      console.log(payload);
      return {
        ...prevState,
        overpassQuery: payload,
      };

    case CHANGE_ALL_EDITED_STREETS_WITHIN_CITY:
      return {
        ...prevState,
        allEditedStreetsInCity: payload,
      };
    case CHANGE_GEO_JSON_COLOR_MAP:
      console.log(payload);
      return{
        ...prevState,
        geoJsonColorMap: payload
      }
    case ADD_GEO_JSON_REF:
      return { ...prevState, geoJSONRef: payload };
    default:
      return prevState;
  }
};

export default GeneralReducer;
