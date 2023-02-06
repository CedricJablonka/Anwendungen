import MyGeoJson from "./myGeoJson";
import { useContext } from "react";
import CompleteStreetContext from "../../context/complete-street-context/CompleteStreetContext";
import GeneralContext from "../../context/general-context/GeneralContext";

const MyStreetSections = () => {
  const {
    completeStreetData,
    changeShowCustomStreetSectionForm,
    changeCurrentCustomStreetSectionId,
    showCustomStreetSections,
  } = useContext(CompleteStreetContext);
  const { changeStreetClickedPosition } = useContext(GeneralContext);
  const onGeoJsonClick = (e, customStreetSectionId) => {
    changeStreetClickedPosition({
      latlng: e.latlng,
      streetId: customStreetSectionId,
    });
    changeShowCustomStreetSectionForm(true);
    changeCurrentCustomStreetSectionId(customStreetSectionId);
  };
  return (
    <>
      {showCustomStreetSections ? (
        completeStreetData?.geoJson?.features?.map((singleFeature) => {
          const streetId = singleFeature?.properties?.customStreetSectionId;

          return (
            <MyGeoJson
              streetId={streetId}
              key={streetId}
              data={singleFeature}
              style={() => {
                return { color: "red" };
              }}
              onClick={onGeoJsonClick}
            />
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};
export default MyStreetSections;
