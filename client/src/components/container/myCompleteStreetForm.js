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
    addCustomStreetSection,
    currentCustomStreetSectionId,
    completeStreetData,
    sendCompleteStreetData,
    changeCustomStreetSectionPlainData,
  } = useContext(CompleteStreetContext);


  const {changePlainData} = useContext(GeneralContext);

  const { position } = props;

  let tmpSingleStreetSectionData = {};
  const [customStreetSectionData, setCustomStreetSectionData] = useState(
    {...tmpSingleStreetSectionData}
  );

        

  useEffect(() => {
    console.log("fired!")
    updateCustomStreetSectionData();
  }, [currentCustomStreetSectionId])
  

  
  const updateCustomStreetSectionData = () => {
    console.log(currentCustomStreetSectionId)
    tmpSingleStreetSectionData =
    completeStreetData?.customStreetSections?.length === 0
      ? {
          ...completeStreetDataFields,
          customStreetSectionId: uuid().slice(0, 8),
        }
      : {
          ...completeStreetData?.customStreetSections[
            currentCustomStreetSectionId
          ],
        };
        console.log(tmpSingleStreetSectionData);
    
    tmpSingleStreetSectionData?.plainData && changePlainData(tmpSingleStreetSectionData?.plainData);
          
    setCustomStreetSectionData((pre) => ({
      ...pre,
      ...tmpSingleStreetSectionData
    }));
  };

  console.log(customStreetSectionData);
  const onCustomStreetSectionChange = (newValue, fieldId) => {
    setCustomStreetSectionData((pre) => ({
      ...pre,
      [fieldId]: newValue,
    }));
  };

  const onSubmit = async () => {
    console.log(customStreetSectionData);
    const completeStreetData = addCustomStreetSection(customStreetSectionData);
    console.log(completeStreetData);

    await sendCompleteStreetData(completeStreetData);
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
      {showCustomStreetSectionForm && (
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
      )}
      <MyMapDrawer />
    </>
  );
};
export default MyCompleteStreetForm;
