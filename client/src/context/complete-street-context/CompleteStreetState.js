import React, { useReducer, useContext } from "react";
import CompleteStreetReducer from "./CompleteStreetReducer";
import CompleteStreetContext from "./CompleteStreetContext";
import GeneralContext from "../general-context/GeneralContext";
import { streetDetailsData } from "../../constants/streetDetailsData";
import { completeStreetDataFields } from "../../constants/completeStreetDataFields";
import { v4 as uuid } from "uuid";
import axios from "axios";
import {
  SEND_COMPLETE_STREET_DATA_URL,
  GET_COMPLETE_STREET_DATA_URL,
} from "../../constants/serverConfigs";

import {
  CHANGE_COMPLETE_STREET_DATA,
  ADD_CUSTOM_STREET_SECTION_COORDINATES,
  CHANGE_SHOW_CUSTOM_STREET_SECTIONS,
  CHANGE_SHOW_CUSTOM_STREET_SECTION_FORM,
  CHANGE_CURRENT_CUSTOM_STREET_SECTION_ID,
  CHANGE_CURRENT_CUSTOM_STREET_SECTION_DATA,
} from "../types";

const CompleteStreetState = ({ children }) => {
  const initialState = {
    completeStreetData: {customStreetSections: []},
    currentCustomStreetSectionCoordinates: [],
    showCustomStreetSections: false,
    showCustomStreetSectionForm: false,
    currentCustomStreetSectionId: "",
    currentCustomStreetSectionData: completeStreetDataFields,
  };
  const {
    streetDetailsData,
    plainsDetailsData,
    showUserMessage,
    selectedCompleteStreet,
    userLocationInfo,
    changePlainsDetailsData,
  } = useContext(GeneralContext);
  const [state, dispatch] = useReducer(CompleteStreetReducer, initialState);
  const headers = { headers: { "Content-Type": "application/json" } };
  const city = userLocationInfo.city;

  //when a new custom street section is created this function can be used to add it to the complete street
  const addCustomStreetSection = (customStreetSection) => {
    const customStreetSectionId = customStreetSection.customStreetSectionId;
    let tmpCompleteStreetData = {
      ...state.completeStreetData,
      customStreetSections: {
        ...state.completeStreetData.customStreetSections,
        [customStreetSectionId]: {
          ...customStreetSection,
          plainData: plainsDetailsData,
          coordinates: state.currentCustomStreetSectionCoordinates,
        },
      },
    };

    dispatch({
      type: CHANGE_COMPLETE_STREET_DATA,
      payload: tmpCompleteStreetData,
    });

    return tmpCompleteStreetData;
  };

  const addCurrentStreetSectionCoordinates = (coordinates) => {
    dispatch({
      type: ADD_CUSTOM_STREET_SECTION_COORDINATES,
      payload: coordinates,
    });
  };

  const getCompleteStreetData = async (completeStreetId) => {
    console.log(completeStreetId);

    try {
      const completeStreetData = await axios.get(
        GET_COMPLETE_STREET_DATA_URL +
          `/${encodeURIComponent(completeStreetId)}`,
        { completeStreetId: completeStreetId },
        headers
      );

      console.log(completeStreetData?.data);
      dispatch({
        type: CHANGE_COMPLETE_STREET_DATA,
        payload: completeStreetData?.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const sendCompleteStreetData = async (completeStreetData) => {
    console.log(completeStreetData);
    const tmpCompleteStreetData = {
      ...completeStreetData,
      geoJson: toGeoJson(completeStreetData.customStreetSections),
      completeStreetId: selectedCompleteStreet.streetId,
    };
    console.log(tmpCompleteStreetData.geoJson);
    try {
      const completeStreetData = await axios.post(
        SEND_COMPLETE_STREET_DATA_URL,
        {
          completeStreetData: tmpCompleteStreetData,
        },
        headers
      );
      console.log(completeStreetData.data.data);
      changeCompleteStreetData(completeStreetData.data);
      showUserMessage({
        message: completeStreetData.data.message,
        messageType: "SUCCESS",
      });
    } catch (error) {
      showUserMessage({ message: error.message, messageType: "ERROR" });
    }
  };

  /***************helper functions*************************** */
  const createGeoJsonFeature = (customStreetSection) => {
    let tmpCoordinates = [];
    customStreetSection?.coordinates?.forEach((coordinate) => {
      //care the order of lng and lat
      tmpCoordinates.push([coordinate.lng, coordinate.lat]);
    });

    return {
      type: "Feature",
      id: customStreetSection.customStreetSectionId,
      geometry: {
        type: "LineString",
        coordinates: [...tmpCoordinates],
      },
      properties: {
        customStreetSectionId: customStreetSection.customStreetSectionId,
        hasValues: customStreetSection.hasValues,
        usage: customStreetSection.usage,
        axleType: customStreetSection.axleType,
        streetType: customStreetSection.streetType,
        installationYear: customStreetSection.installationYear,
        plaines: customStreetSection.plaines,
      },
    };
  };

  const toGeoJson = (streetSections) => {
    let tmpFeaturesArray = [];

    Object.values(streetSections).forEach((customStreetSection) => {
      let feature = createGeoJsonFeature(customStreetSection);
      tmpFeaturesArray.push(feature);
    });
    return { type: "FeatureCollection", features: tmpFeaturesArray };
  };

  /******************change functions**************************** */
  const changeShowCustomStreetSections = (status) => {
    dispatch({
      type: CHANGE_SHOW_CUSTOM_STREET_SECTIONS,
      payload: status,
    });
  };

  const changeShowCustomStreetSectionForm = (status) => {
    dispatch({
      type: CHANGE_SHOW_CUSTOM_STREET_SECTION_FORM,
      payload: status,
    });
  };

  const changeCurrentCustomStreetSectionId = (id) => {
    dispatch({
      type: CHANGE_CURRENT_CUSTOM_STREET_SECTION_ID,
      payload: id,
    });
  };

  const changeCompleteStreetData = (data) => {
    dispatch({
      type: CHANGE_COMPLETE_STREET_DATA,
      payload: data,
    });
  };

  const changeCustomStreetSection = (
    customStreetSectionId,
    updatedStreetSection
  ) => {
    const tmpCustomStreetSections = {
      ...state.completeStreetData.customStreetSection,
      [customStreetSectionId]: updatedStreetSection,
      plainData: plainsDetailsData,
      coordinates: state.currentCustomStreetSectionCoordinates,
    };
    const tmpCompleteStreetData = {
      ...state.completeStreetData,
      customStreetSections: tmpCustomStreetSections,
    };

    dispatch({
      type: CHANGE_COMPLETE_STREET_DATA,
      payload: tmpCompleteStreetData,
    });
    return tmpCompleteStreetData;
  };

  const changeCustomStreetSectionPlainData = (
    plainIndex,
    fieldId,
    newValue
  ) => {
    changePlainsDetailsData(plainIndex, fieldId, newValue);
  };

  const changeCurrentCustomStreetSectionData = (data) => {
    dispatch({
      type: CHANGE_CURRENT_CUSTOM_STREET_SECTION_DATA,
      payload: data,
    });
  };

  return (
    <CompleteStreetContext.Provider
      value={{
        addCurrentStreetSectionCoordinates: addCurrentStreetSectionCoordinates,
        sendCompleteStreetData: sendCompleteStreetData,
        addCustomStreetSection: addCustomStreetSection,
        getCompleteStreetData: getCompleteStreetData,
        changeShowCustomStreetSections: changeShowCustomStreetSections,
        changeShowCustomStreetSectionForm: changeShowCustomStreetSectionForm,
        changeCurrentCustomStreetSectionId: changeCurrentCustomStreetSectionId,
        changeCustomStreetSectionPlainData: changeCustomStreetSectionPlainData,
        changeCustomStreetSection: changeCustomStreetSection,
        completeStreetData: state.completeStreetData,
        showCustomStreetSections: state.showCustomStreetSections,
        showCustomStreetSectionForm: state.showCustomStreetSectionForm,
        currentCustomStreetSectionId: state.currentCustomStreetSectionId,
        currentCustomStreetSectionCoordinates:
          state.currentCustomStreetSectionCoordinates,
      }}
    >
      {children}
    </CompleteStreetContext.Provider>
  );
};

export default CompleteStreetState;
