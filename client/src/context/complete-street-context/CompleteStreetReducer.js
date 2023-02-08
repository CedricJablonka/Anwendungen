import {
  CHANGE_COMPLETE_STREET_DATA,
  ADD_CUSTOM_STREET_SECTION_COORDINATES,
  CHANGE_SHOW_CUSTOM_STREET_SECTIONS,
  CHANGE_SHOW_CUSTOM_STREET_SECTION_FORM,
  CHANGE_CURRENT_CUSTOM_STREET_SECTION_ID,
  CHANGE_CURRENT_CUSTOM_STREET_SECTION_DATA,
} from "../types";

const CompleteStateReducer = (prevState, { type, payload }) => {
  switch (type) {
    case CHANGE_COMPLETE_STREET_DATA:
      console.log(payload);
      return { ...prevState, completeStreetData: payload };
    case ADD_CUSTOM_STREET_SECTION_COORDINATES:
      return { ...prevState, currentCustomStreetSectionCoordinates: payload };
    case CHANGE_SHOW_CUSTOM_STREET_SECTIONS:
      return { ...prevState, showCustomStreetSections: payload };
    case CHANGE_SHOW_CUSTOM_STREET_SECTION_FORM:
      return { ...prevState, showCustomStreetSectionForm: payload };
    case CHANGE_CURRENT_CUSTOM_STREET_SECTION_ID:
      return { ...prevState, currentCustomStreetSectionId: payload };
    case CHANGE_CURRENT_CUSTOM_STREET_SECTION_DATA:
      return { ...prevState, currentCustomStreetSectionData: payload };
    default:
      return prevState;
  }
};

export default CompleteStateReducer;
