import React, { useReducer, useRef, useState } from "react";
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
  CHANGE_SELECTED_COMPLETE_STREET,
  CHANGE_GEO_JSON_COLOR_MAP,
  CHANGE_SHOW_SIDE_SHEET,
  CHANGE_PLAINS_DETAILS_DATA,
} from "../types";
import { overpassHighwayTypes } from "../../constants/overpassHighwayTypes";

const GeneralState = ({ children }) => {
  const initialState = {
    streetData: [],
    selectedCompleteStreet: {},
    streetDetailsData: streetDetailsData,
    plainsDetailsData: [],
    overpassHighwayTypes: overpassHighwayTypes,
    overpassQuery: "",
    showStreetDetailInformation: false,
    streetClickedPosition: {},
    clickedPosition: {},
    isLoadingStreetData: false,
    isLoadingStreetDetailsData: false,
    allEditedStreetsInCity: {},
    showSideSheet: false,
    geoJsonRefs: new Map(),
    geoJsonColorsMap: new Map(),
    streetMode: "SINGLE",
    userLocationInfo: {
      city: "",
      position: [51.4818111, 7.2196635],
      lat: 51.4818111,
      lng: 7.2196635,
      label: "",
      bounds: [
        [51.4105043, 7.1020817],
        [51.5313751, 7.3493347],
      ],
    },
  };

  const [state, dispatch] = useReducer(GeneralReducer, initialState);
  const [isLoading, setIsLoading] = useState(true)
  const headers = { headers: { "Content-Type": "application/json" } };
  const osmtogeojson = require("osmtogeojson");

  /************************************** Database related Actions*************************************************/

  const getAllEditedStreetsInCity = async (position) => {
    /*this functions takes a latitude and a longitude stored in a postion array and returns
    it will find the osm id that matches the given coordinates and will find the nearest city that
    to that coordinate. Then it will return all edited streets in this city.*/

    console.log(position);
    const city = await getCityByCoordinates(position);
    console.log(city);
    try {
      const returnedData = await axios.get(
        GET_ALL_STREET_DETAILS_WITHIN_City_URL + `${encodeURIComponent(city)}`,
        headers
      );

      dispatch({
        type: CHANGE_ALL_EDITED_STREETS_WITHIN_CITY,
        payload: returnedData.data,
      });

      return returnedData.data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStreetDetailsData = async (streetId) => {
    /*function to perform the api call for retrieving the street details for one particular street part by id */
    dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: true });
    try {
      

      const streetDetailsData = await axios.get(
        STREET_GET_DETAILS_URL + `/${encodeURIComponent(streetId)}`,
        { streetId: streetId },
        headers
      );

      //maybe there is a way to combine plainsDetailsData and streetDetailsData
      //for now two dispatches are needed

      console.log(streetDetailsData);

      let tmpPlaines = streetDetailsData.data.plaines;
      let tmpStreetDetailsData = {...streetDetailsData.data};
      delete tmpStreetDetailsData.plaines;

      dispatch({
        type: CHANGE_STREET_DETAILS_DATA,
        payload: {
          ...tmpStreetDetailsData,
          streetName: await getOsmStreetRef(streetId),
        },
      });

      dispatch({
        type: CHANGE_PLAINS_DETAILS_DATA,
        payload: [...tmpPlaines],
      });

      dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: false });
      
    } catch (error) {
      dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: false });
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

  const addPlain = (newPlainData) => {
    let tmpPlainData = [...state.plainsDetailsData, newPlainData];
    console.log(tmpPlainData);
    dispatch({ type: CHANGE_PLAINS_DETAILS_DATA, payload: tmpPlainData });
  };

  const deletePlain = (plainIndex) => {
    let tmpPlainData = [...state.plainsDetailsData];
    tmpPlainData.splice(plainIndex, 1);
    console.log(tmpPlainData);
    dispatch({ type: CHANGE_PLAINS_DETAILS_DATA, payload: tmpPlainData });
  };

  const changePlainsDetailsData = (plainIndex, fieldId, newValue) => {
    let tmpPlainData = [...state.plainsDetailsData];
    tmpPlainData[plainIndex][fieldId] = newValue;
    let plainArea = tmpPlainData[plainIndex]["area"];
    let plainThickness = tmpPlainData[plainIndex]["thickness"];
    let layerDensity = tmpPlainData[plainIndex]["layerType"];
    let plainMass = plainArea * plainThickness * layerDensity;

    tmpPlainData[plainIndex]["mass"] = plainMass;
    dispatch({
      type: CHANGE_PLAINS_DETAILS_DATA,
      payload: tmpPlainData,
    });
  };

  const sendStreetDetailsData = async (streetId) => {
    /*TODO return if streetDetailsData is empty*/

    //In order to not interfere with the copy and paste functionality unique properties like latlng, city and street id will be added in this
    //add latlng, cityName the street is located (for filtering all modified streets within a city) and the osm streetid
    let preparedStreetDetailsData = {
      ...state.streetDetailsData,
      plaines: [...state.plainsDetailsData],
      streetId: streetId,
      latlng: state.streetClickedPosition.latlng,
      city: await getCityByCoordinates(state.userLocationInfo.position),
      osmDetails: await getOsmStreetInformation(streetId),
    };
    console.log(preparedStreetDetailsData);

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

      getAllEditedStreetsInCity(state.userLocationInfo.position);
    } catch (error) {
      showUserMessage({ message: error.message, messageType: "ERROR" });
    }
  };

  /***********foreign api actions ********************************/
  const getCityByCoordinates = async (position) => {
    const lat = position[0];
    const lng = position[1];

    try {
      const returnedData = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lng)}`,
        headers
      );
      console.log(returnedData.data.address.city);
      return returnedData.data.address.city;
    } catch (error) {}
  };

  const getOsmStreetInformation = async (streetId) => {
    /*https://api.openstreetmap.org/api/0.6/way/515641498 */
    try {
      const returnedData = await axios.get(
        `https://api.openstreetmap.org/api/0.6/way/${streetId}`,
        headers
      );

      return returnedData.data.elements[0];
    } catch (error) {
      showUserMessage({ messageType: "ERROR", message: error.message });
    }
  };

  const getOsmStreetRef = async (streetId) => {
    const returnedData = await getOsmStreetInformation(streetId);

    //motorways dont have a name tag so a check is necessary if name tag does not exist it will use the ref tag

    return returnedData.tags.ref;
  };

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

      let geoJsonConversion = osmtogeojson(returnedData.data);
      /*console.log("complete Conversion: ", geoJsonConversion)
      console.log("all nodes: ",osmtogeojson({...returnedData.data, elements: nodeElements}))
      console.log("all ways: ",osmtogeojson({...returnedData.data, elements: wayElements}))*/
      console.log(geoJsonConversion);
      await createGeoJsonColorMap({
        geoJsonData: geoJsonConversion,
        color: "#3388ff",
      });
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

  const getOverpassCompleteWay = async (streetId) => {
    /*[out:json];(nwr[name="Ruhrschnellweg"](51.4105043,7.1020817,51.5313751,7.3493347);>;);
    out skel qt; */
    try {
      let streetRef = await getOsmStreetRef(streetId);

      //Todo city should be saved somewhere more globally to prevent unnecessary requests
      let cityName = await getCityByCoordinates(
        state.userLocationInfo.position
      );
      let boundingBox = [
        ...state.userLocationInfo.bounds[0],
        ...state.userLocationInfo.bounds[1],
      ];
      let overPassQuery = `[out:json];(nwr[ref="${streetRef}"](${boundingBox.join(
        ","
      )});>;);out skel qt;`;

      const returnedData = await axios.post(
        "https://www.overpass-api.de/api/interpreter",
        overPassQuery
      );

      let completeStreet = osmtogeojson(returnedData.data);
      //remove nodes from the geojson object to avoid rendering POI Markers on the street
      completeStreet = completeStreet.features.filter(
        (feature) => feature.geometry.type === "LineString"
      );
      console.log(completeStreet);

      changeSelectedCompleteStreet({
        data: completeStreet,
        streetId: `${streetRef + cityName}`,
      });

      return completeStreet;
    } catch (error) {
      showUserMessage({
        messageType: "ERROR",
        message: error.message,
      });
    }
  };

  /**************************************change Actions****************************************************** */
  //this is just a helper function to avoid repeating
  const changeGeoJsonColor = (props) => {
    const { streetId, color } = props;

    let tmpGeoJsonColorMap = state.geoJsonColorMap;

    tmpGeoJsonColorMap.set(streetId, { color: color });

    dispatch({
      type: CHANGE_GEO_JSON_COLOR_MAP,
      payload: tmpGeoJsonColorMap,
    });
  };

  const changeStreetClickedPosition = (latlng) => {
    dispatch({ type: CHANGE_STREET_CLICKED_POSITION, payload: latlng });

    changeShowStreetDetailInformation();
  };

  const changeSelectedCompleteStreet = (completeStreetGeoJson) => {
    dispatch({
      type: CHANGE_SELECTED_COMPLETE_STREET,
      payload: completeStreetGeoJson,
    });
  };

  const changeShowStreetDetailInformation = () => {
    /*change function for setting the boolean variabel for showing the detail modal */
    dispatch({ type: CHANGE_SHOW_STREET_DETAIL_INFORMATION, payload: true });
  };

  const ChangeIsLoadingStreetDetailsData = (status) => {
    dispatch({ type: CHANGE_IS_LOADING_STREET_DETAILS_DATA, payload: status });
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

  const changeShowSideSheet = (showSideSheet) => {
    dispatch({ type: CHANGE_SHOW_SIDE_SHEET, payload: showSideSheet });
  };

  /************************************************* utility *********************************************/
  const hasValues = (obj) => {
    if (Object?.keys(obj)?.length === 0) return false;
    else return true;
  };

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

  const createGeoJsonColorMap = async (props) => {
    let { geoJsonData, color } = props;
    try {
      const position = [state.userLocationInfo.lat, state.userLocationInfo.lng];

      console.log(position);

      let allEditedStreetsInCity = await getAllEditedStreetsInCity(position);

      let tmpGeoJsonColorMap = new Map();

      geoJsonData?.features.map((singleFeature) => {
        let streetId = singleFeature.id.split("/")[1];

        tmpGeoJsonColorMap.set(
          streetId,
          streetId in allEditedStreetsInCity
            ? { color: "green" }
            : { color: color }
        );
      });

      dispatch({
        type: CHANGE_GEO_JSON_COLOR_MAP,
        payload: tmpGeoJsonColorMap,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const copyStreetDetailData = async (streetDetailData) => {
    if ("clipboard" in navigator) {
      //this delete statements are very ugly code should be refactored in the future
      let tmpStreetDetailsData = {...streetDetailData};
      delete tmpStreetDetailsData._id;

      delete tmpStreetDetailsData.streetId;

      delete tmpStreetDetailsData.latlng;

      delete tmpStreetDetailsData.city;

      delete tmpStreetDetailsData.osmDetails;


      

      await navigator.clipboard.writeText(
        JSON.stringify({
          streetDetailData: tmpStreetDetailsData,
          plainData: state.plainsDetailsData,
        })
      );

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
      let pastedData = await navigator.clipboard.readText();
      pastedData = JSON.parse(pastedData);
      
      //there is some room where street id, city and latlng from the old street details are copied and pasted as well
      //this has no effect on the functionality but it is not the best style
      dispatch({
        type: CHANGE_STREET_DETAILS_DATA,
        payload: pastedData.streetDetailData,
      });

      dispatch({
        type: CHANGE_PLAINS_DETAILS_DATA,
        payload: pastedData.plainData,
      });
      showUserMessage({
        messageType: "SUCCESS",
        message: "Pasted Street Detail Data Succesfully!",
      });
    } catch (error) {
      console.log(error);
      showUserMessage({
        messageType: "ERROR",
        message:
          "Pasted Data has the wrong format, please use the copy function on valid Street Details Data!",
      });
    }
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
        changePlainsDetailsData: changePlainsDetailsData,
        addPlain: addPlain,
        deletePlain: deletePlain,
        sendStreetDetailsData: sendStreetDetailsData,
        showUserMessage: showUserMessage,
        getCityByCoordinates: getCityByCoordinates,
        getAllEditedStreetsInCity: getAllEditedStreetsInCity,
        copyStreetDetailData: copyStreetDetailData,
        pasteStreetDetailData: pasteStreetDetailData,
        getOsmStreetRef: getOsmStreetRef,
        changeGeoJsonColor: changeGeoJsonColor,
        getOverpassCompleteWay: getOverpassCompleteWay,
        changeShowSideSheet: changeShowSideSheet,
        changeSelectedCompleteStreet: changeSelectedCompleteStreet,
        hasValues: hasValues,
        showSideSheet: state.showSideSheet,
        userLocationInfo: state.userLocationInfo,
        streetData: state.streetData,
        overpassHighwayTypes: state.overpassHighwayTypes,
        overpassQuery: state.overpassQuery,
        isLoadingStreetData: state.isLoadingStreetData,
        isLoadingStreetDetailsData: state.isLoadingStreetDetailsData,
        showStreetDetailInformation: state.showStreetDetailInformation,
        streetClickedPosition: state.streetClickedPosition,
        streetDetailsData: state.streetDetailsData,
        plainsDetailsData: state.plainsDetailsData,
        allEditedStreetsInCity: state.allEditedStreetsInCity,
        geoJsonColorMap: state.geoJsonColorMap,
        selectedCompleteStreet: state.selectedCompleteStreet,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
