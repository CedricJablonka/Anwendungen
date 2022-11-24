import React, { useReducer } from "react";
import { toaster } from "evergreen-ui";
import GeneralContext from "./GeneralContext";
import GeneralReducer from "./GeneralReducer";
import axios from "axios";
import { streetDetailsData } from "../../constants/streetDetailsData";
import {
  STREET_GET_DETAILS_URL,
  SEND_STREET_DETAILS_URL,
  GET_ALL_STREET_DETAILS_WITHIN_City_URL,
} from "../../constants/serverConfigs";

import {
  FETCH_STREET_DATA,
  CHANGE_HIGHWAY_TYPE_SELECTION,
  UPDATE_OVERPASS_QUERY,
  CHANGE_IS_LOADING_STREET_DATA,
  CHANGE_USER_LOCATION_INFO,
  CHANGE_SHOW_STREET_DETAIL_INFORMATION,
  CHANGE_STREET_CLICKED_POSITION,
  CHANGE_STREET_DETAILS_DATA,
  CHANGE_IS_LOADING_STREET_DETAILS_DATA,
  CHANGE_ALL_EDITED_STREETS_WITHIN_CITY,
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
    isLoadingStreetDetailsData: true,
    allEditedStreetsInCity: {},
    userLocationInfo: {
      lat: "",
      long: "",
      label: "",
      bounds: [
        [51.4105043, 7.1020817],
        [51.5313751, 7.3493347],
      ],
    },
  };

  const [state, dispatch] = useReducer(GeneralReducer, initialState);
  const headers = { headers: { "Content-Type": "application/json" } };

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
      let wayElements = returnedData.data.elements.filter(
        (singleFeature) => singleFeature.type === "way"
      );
      let nodeElements = returnedData.data.elements.filter(
        (singleFeature) => singleFeature.type === "node"
      );
      console.log(wayElements);
      let tmp = { ...returnedData.data, elements: nodeElements };

      let geoJsonConversion = osmtogeojson(returnedData.data);
      /*console.log("complete Conversion: ", geoJsonConversion)
      console.log("all nodes: ",osmtogeojson({...returnedData.data, elements: nodeElements}))
      console.log("all ways: ",osmtogeojson({...returnedData.data, elements: wayElements}))*/

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
  };

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
    dispatch({ type: CHANGE_STREET_CLICKED_POSITION, payload: latlng });

    changeShowStreetDetailInformation();
  };

  const changeShowStreetDetailInformation = () => {
    /*change function for setting the boolean variabel for showing the detail modal */
    dispatch({ type: CHANGE_SHOW_STREET_DETAIL_INFORMATION, payload: true });
  };

  const getAllEditedStreetsInCity = async (position) => {
    /*this functions takes a latitude and a longitude stored in a postion array and returns
    it will find the odm id that matches the given coordinates and will find the nearest city that
    to that coordinate. Then it will return all edited streets in this city.*/
    const osmId = await getOsmIdByCoordinates(position[0], position[1]);
    const city = await getCity(osmId, "N");
    try {
      const returnedData = await axios.get(
        GET_ALL_STREET_DETAILS_WITHIN_City_URL + `${encodeURIComponent(city)}`,
        headers
      );

      dispatch({
        type: CHANGE_ALL_EDITED_STREETS_WITHIN_CITY,
        payload: returnedData.data,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStreetDetailsData = async (streetId) => {
    /*function to perform the api call for retrieving the street details for one particular street part by id */

    console.log(streetId);

    try {
      dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: true });
      console.log(STREET_GET_DETAILS_URL + `/${encodeURIComponent(streetId)}`);
      const streetDetailsData = await axios.get(
        STREET_GET_DETAILS_URL + `/${encodeURIComponent(streetId)}`,
        { streetId: streetId },
        headers
      );

      console.log(streetDetailsData);

      dispatch({
        type: CHANGE_STREET_DETAILS_DATA,
        payload: streetDetailsData.data,
      });

      dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: false });
    } catch (error) {
      dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: false });

      console.log(error.message);
    }
  };

  const changeStreetDetailsData = (fieldToChange, newValue) => {
    /*TODO: this function should be able to change a single field or all fields */
    const updatedStreetDetails = {
      ...state.streetDetailsData,
      [fieldToChange]: newValue,
    };

    dispatch({
      type: CHANGE_STREET_DETAILS_DATA,
      payload: updatedStreetDetails,
    });
  };

  const sendStreetDetailsData = async (streetId) => {
    /*TODO return if streetDetailsData is empty*/

    //In order to not interfere with the copy and paste functionality unique properties like latlng, city and street id will be added in this
    //add latlng, cityName the street is located (for filtering all modified streets within a city) and the osm streetid
    let preparedStreetDetailsData = {
      ...state.streetDetailsData,
      streetId: streetId,
      latlng: state.streetClickedPosition.latlng,
      city: await getCity(streetId, "W"),
      osmDetails: await getOsmStreetInformation(streetId),
    };

    try {
      const response = await axios.post(
        SEND_STREET_DETAILS_URL,
        {
          streetDetailsData: preparedStreetDetailsData,
        },
        headers
      );
      showUserMessage({
        message: response.data.message,
        messageType: "SUCCESS",
      });
    } catch (error) {
      showUserMessage({ message: error.message, messageType: "ERROR" });
    }
  };

  /*********** utility ********************************/
  const showUserMessage = (props) => {
    const { messageType, message } = props;

    if (messageType === "SUCCESS") {
      toaster.success(message);
    } else if (messageType === "ERROR") {
      toaster.danger(message);
    } else {
      toaster.danger(message);
    }
  };
  const ChangeIsLoadingStreetDetailsData = (status) => {
    dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: status });
  };
  /*********** get all street details within a city ********************************/
  const getCity = async (streetId, osmType) => {
    /*https://nominatim.openstreetmap.org/reverse?format=xml&osm_type=W&osm_id=206488036
    based on a given streetId / osmId find the city in which a way or a node is located
     */

    try {
      const returnedData = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&osm_type=${encodeURIComponent(
          osmType
        )}&osm_id=${encodeURIComponent(streetId)}`,
        headers
      );

      return returnedData.data.address.city;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getOsmIdByCoordinates = async (lat, lng) => {
    try {
      const returnedData = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lng)}`,
        headers
      );
      return returnedData.data.osm_id;
    } catch (error) {}
  };

  const getOsmStreetInformation = async (streetId) => {
    /*https://api.openstreetmap.org/api/0.6/way/515641498 */
    try {
      const returnedXmlData = await axios.get(
        `https://api.openstreetmap.org/api/0.6/way/${streetId}`,
        headers
      );

      return returnedXmlData.data.elements[0];
    } catch (error) {
      showUserMessage({ messageType: "ERROR", message: error.message });
    }
  };

  /**********************************************copy and paste street detail data to clipboard************************************************** */
  const copyStreetDetailData = async (streetDetailData) => {
    if ("clipboard" in navigator) {
      //this delete statements is very ugly code should be refactored in the future
      delete streetDetailData._id;
      delete streetDetailData.streetId;
      delete streetDetailData.latlng;
      delete streetDetailData.city;
      delete streetDetailData.osmDetails;

      console.log(streetDetailData)
      await navigator.clipboard.writeText(JSON.stringify(streetDetailData));
      showUserMessage({
        messageType: "SUCCESS",
        message: "Copied Street Details Data!",
      });
    } else {
      showUserMessage({
        messageType: "ERROR",
        message: "Clipboard API not supported!",
      });
    }
  };

  const pasteStreetDetailData = async () => {
    try {
      const pastedData = await navigator.clipboard.readText();

      //there is some room where street id, city and latlng from the old street details are copied and pasted as well
      //this has no effect on the functionality but it is not the best style
      dispatch({
        type: CHANGE_STREET_DETAILS_DATA,
        payload: JSON.parse(pastedData),
      });
      showUserMessage({
        messageType: "SUCCESS",
        message: "Pasted Street Detail Data Succesfully!",
      });
    } catch (error) {
      showUserMessage({
        messageType: "ERROR",
        message: error.message,
      });
    }
  };
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
        changeStreetDetailsData: changeStreetDetailsData,
        sendStreetDetailsData: sendStreetDetailsData,
        showUserMessage: showUserMessage,
        getOsmIdByCoordinates: getOsmIdByCoordinates,
        getAllEditedStreetsInCity: getAllEditedStreetsInCity,
        copyStreetDetailData: copyStreetDetailData,
        pasteStreetDetailData: pasteStreetDetailData,
        userLocationInfo: state.userLocationInfo,
        streetData: state.streetData,
        highwayTypes: state.overpassHighwayTypes,
        overpassQuery: state.overpassQuery,
        isLoadingStreetData: state.isLoadingStreetData,
        showStreetDetailInformation: state.showStreetDetailInformation,
        streetClickedPosition: state.streetClickedPosition,
        streetDetailsData: state.streetDetailsData,
        allEditedStreetsInCity: state.allEditedStreetsInCity,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
