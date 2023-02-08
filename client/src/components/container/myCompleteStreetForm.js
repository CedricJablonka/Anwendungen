import MyMapDrawer from "../map-uis/myMapDrawer";
import { Pane } from "evergreen-ui";
import MyForm from "./myForm";
import { useContext, useState, useEffect } from "react";
import CompleteStreetContext from "../../context/complete-street-context/CompleteStreetContext";
import GeneralContext from "../../context/general-context/GeneralContext";
import { completeStreetDataFields } from "../../constants/completeStreetDataFields";
import { v4 as uuid } from "uuid";
import MyPopup from "../map-uis/myPopup";
const MyCompleteStreetForm = (props) => {
  const {
    changeShowCustomStreetSections,
    showCustomStreetSectionForm,
    changeShowCustomStreetSectionForm,
    changeCustomStreetSection,
    currentCustomStreetSectionId,
    completeStreetData,
    sendCompleteStreetData,
    changeCustomStreetSectionPlainData,
  } = useContext(CompleteStreetContext);

  const { changePlainData } = useContext(GeneralContext);

  const { position, completeStreetId } = props;
  let tmpSingleStreetSectionData = {};
  const [customStreetSectionData, setCustomStreetSectionData] = useState({
    ...tmpSingleStreetSectionData,
  });

  useEffect(() => {
    //this check is necessary if you switch from single section mode to complete section mode and a custom street section id has not been defined yet
    currentCustomStreetSectionId !== "" && updateCustomStreetSectionData();
  }, [currentCustomStreetSectionId]);

  const updateCustomStreetSectionData = () => {
    console.log(currentCustomStreetSectionId);
    console.log(completeStreetData)
    //todo there is a case missing, if complete street has sections and a new section is created
    /*tmpSingleStreetSectionData =
      completeStreetData?.customStreetSections?.length === 0
        ? {
            ...completeStreetDataFields,
            customStreetSectionId: uuid().slice(0, 8),
          }
        : {
            ...completeStreetData?.customStreetSections[
              currentCustomStreetSectionId
            ],
          };*/

    tmpSingleStreetSectionData = {
      ...completeStreetData?.customStreetSections[currentCustomStreetSectionId],
    };
    console.log(tmpSingleStreetSectionData);
    tmpSingleStreetSectionData?.plainData &&
      changePlainData(tmpSingleStreetSectionData?.plainData);

    setCustomStreetSectionData((pre) => ({
      ...pre,
      ...tmpSingleStreetSectionData,
    }));
  };

  const onCustomStreetSectionChange = (newValue, fieldId) => {
    setCustomStreetSectionData((pre) => ({
      ...pre,
      [fieldId]: newValue,
    }));
  };

  const onSubmit = async () => {
    console.log(customStreetSectionData)
    console.log(currentCustomStreetSectionId)
    const tmpCompleteStreetData = changeCustomStreetSection(
      currentCustomStreetSectionId,
      customStreetSectionData
    );
      console.log(tmpCompleteStreetData)
    await sendCompleteStreetData(tmpCompleteStreetData);
  };

  const handleShowAllStreetSections = () => {
    changeShowCustomStreetSections(true);
  };

  const onCustomStreetSectionFormClose = () => {
    changeShowCustomStreetSectionForm(false);
  };

  const onFormChange = (newValue, plainIndex, fieldId) => {
    if (plainIndex !== undefined) {
      changeCustomStreetSectionPlainData(
        plainIndex,
        fieldId,
        newValue,
        currentCustomStreetSectionId
      );
    } else {
      onCustomStreetSectionChange(newValue, fieldId);
    }
  };

  return (
    <>
      <MyPopup position={position}>
        <Pane>
          <Pane>
            <MyForm
              onClose={onCustomStreetSectionFormClose}
              formData={customStreetSectionData}
              streetId={currentCustomStreetSectionId}
              onChange={onFormChange}
              onSubmit={onSubmit}
            />
          </Pane>
        </Pane>
      </MyPopup>
    </>
  );
};
export default MyCompleteStreetForm;
