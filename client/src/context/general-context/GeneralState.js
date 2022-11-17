import React, { useReducer } from "react";
import GeneralContext from "./GeneralContext";
import GeneralReducer from "./GeneralReducer";
import axios from "axios";
import {streetDetailsData} from "../../constants/streetDetailsData";
import {SERVER_URL} from "../../constants/serverConfigs";

import {
  FETCH_STREET_DATA,
  CHANGE_HIGHWAY_TYPE_SELECTION,
  UPDATE_OVERPASS_QUERY,
  CHANGE_IS_LOADING_STREET_DATA,
  CHANGE_USER_LOCATION_INFO,
  CHANGE_SHOW_STREET_DETAIL_INFORMATION,
  CHANGE_STREET_CLICKED_POSITION,
  CHANGE_STREET_DETAILS_DATA,
  CHANGE_IS_LOADING_STREET_DETAILS_DATA
} from "../types";
import { overpassHighwayTypes } from "../../constants/overpassHighwayTypes";


const GeneralState = ({ children }) => {
  const initialState = {
    streetData: [],
    streetDetailsData: streetDetailsData,
    userSearchLocation: [],
    overpassHighwayTypes: overpassHighwayTypes,
    overpassQuery: "",
    showStreetDetailInformation: false,
    streetClickedPosition: {},
    clickedPosition: {},
    isLoadingStreetData: false,
    isLoadingStreetDetailsData: false,
    userLocationInfo: {
      lat: "",
      long: "",
      label: "",
      bounds: [[51.4105043,7.1020817],[51.5313751,7.3493347]],
    },
  };

  const [state, dispatch] = useReducer(GeneralReducer, initialState);

  const sendOverpassQuery = async () => {
    //this function will call the helper function create overpassQuery
    //and then perfom the actual overpass request with the created query
    try {
      dispatch({
        type: CHANGE_IS_LOADING_STREET_DATA,
      });

      const query = createOverpassQuery();
      const returnedData = await axios.post(
        "https://www.overpass-api.de/api/interpreter",
        query
      );
      
      console.log(returnedData.data);
      //converts the osm data into an array of geoJSON objects
      let osmtogeojson = require("osmtogeojson");
      let wayElements = returnedData.data.elements.filter(singleFeature => singleFeature.type === "way");
      let nodeElements = returnedData.data.elements.filter(singleFeature => singleFeature.type === "node");
      console.log(wayElements);
      let tmp = {...returnedData.data, elements: nodeElements}

      let geoJsonConversion = osmtogeojson(returnedData.data);
      console.log("complete Conversion: ", geoJsonConversion)
      console.log("all nodes: ",osmtogeojson({...returnedData.data, elements: nodeElements}))
      console.log("all ways: ",osmtogeojson({...returnedData.data, elements: wayElements}))

      dispatch({
        type: FETCH_STREET_DATA,
        payload: geoJsonConversion,
      });
    } catch (err) {
      dispatch({
        type: CHANGE_IS_LOADING_STREET_DATA,
      });
      console.log(err.message);
    }
  };

  const fetchOsmDetailedStreetData = async (wayId) => {
    /*https://api.openstreetmap.org/api/0.6/way/515641498 */
  };

  

  const getOverpassCompleteWay = async (wayId) => {
    /*[out:json];(nwr[name="Ruhrschnellweg"](51.4105043,7.1020817,51.5313751,7.3493347);>;);
    out skel qt; */
  }

  const changeUserLocationInfo = (userLocationInfo) => {
    dispatch({ type: CHANGE_USER_LOCATION_INFO, payload: userLocationInfo });
  };

  const changeHighwayTypeSelection = (highwayType) => {
    /*this function is used for modifying the overpass query depending on the users selected street types */
    console.log(highwayType);
    dispatch({
      type: CHANGE_HIGHWAY_TYPE_SELECTION,
      payload: { highwayType: highwayType },
    });
  };

  const createOverpassQuery = () => {
    //this function creates an overpass query based on the highwaytypes selected by the user and a bounbding box of the users location

    let selectedHighwayTypes = Object.values(overpassHighwayTypes).filter(
      (type) => type.active
    );

    //get only the highwaytype names
    selectedHighwayTypes = selectedHighwayTypes.map((type) => type.name);

    //array to string with "|" as separator
    selectedHighwayTypes = selectedHighwayTypes.join("|");

    let query = `[out:json];(way["highway"~"^(${selectedHighwayTypes})$"](${
      state.userLocationInfo.bounds[0].toString() +
      "," +
      state.userLocationInfo.bounds[1].toString()
    });>;);
    out skel qt;`;
    dispatch({ type: UPDATE_OVERPASS_QUERY, payload: query });

    /* [out:json];
area[name="Oberhausen"];
(way(area)["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential)$"];>;);
out skel qt;*/

    /*(way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential)$"](51.4486973, 6.7773297,51.5799944, 6.9304578);>;);
out skel qt; */

    return query;
  };

  /************************************** StreetDetailData Actions*************************************************/
  const changeStreetClickedPosition = (latlng) => {
    
    dispatch({ type: CHANGE_STREET_CLICKED_POSITION , payload: latlng})
    changeShowStreetDetailInformation()
    
  }

  const changeShowStreetDetailInformation = () => {
    /*will propably be removed with the matching reducer case */
    dispatch({type: CHANGE_SHOW_STREET_DETAIL_INFORMATION, payload: true})
  }

  const getStreetDetailsData = async (streetId) => {
    
    try {
      dispatch({type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: true});
      const streetDetailsData = await axios.post(SERVER_URL, {streetId: streetId});
      dispatch({type: CHANGE_STREET_DETAILS_DATA, payload: streetDetailsData });
      dispatch({type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: false});

      
    } catch (error) {
      dispatch({type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: false});
      console.log(error.message);
    }
  }

  return (
    <GeneralContext.Provider
      value={{
        createOverpassQuery: createOverpassQuery,
        sendOverpassQuery: sendOverpassQuery,
        changeHighwayTypeSelection: changeHighwayTypeSelection,
        changeUserLocationInfo: changeUserLocationInfo,
        changeStreetClickedPosition: changeStreetClickedPosition,
        changeShowStreetDetailInformation: changeShowStreetDetailInformation,
        getStreetDetailsData: getStreetDetailsData,
        userLocationInfo: state.userLocationInfo,
        streetData: state.streetData,
        highwayTypes: state.overpassHighwayTypes,
        overpassQuery: state.overpassQuery,
        isLoadingStreetData: state.isLoadingStreetData,
        showStreetDetailInformation: state.showStreetDetailInformation,
        streetClickedPosition: state.streetClickedPosition,
        streetDetailsData: state.streetDetailsData

      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
