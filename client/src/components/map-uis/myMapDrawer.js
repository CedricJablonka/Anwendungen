import { FeatureGroup, Circle } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import CompleteStreetContext from "../../context/complete-street-context/CompleteStreetContext";
import GeneralContext from "../../context/general-context/GeneralContext";
import { useContext, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { completeStreetDataFields } from "../../constants/completeStreetDataFields";

const MyMapDrawer = (props) => {
  const { onCreated, completeStreetId} = props;

  const { changeStreetClickedPosition, resetStreetData } =
    useContext(GeneralContext);
  const {
    addCurrentStreetSectionCoordinates,
    changeShowCustomStreetSectionForm,
    changeCurrentCustomStreetSectionId,
    addCustomStreetSection,
    completeStreetData,
    state
  } = useContext(CompleteStreetContext);
  const handleOnEdit = (e) => {};


  useEffect(() => {
    console.log(completeStreetId)
  }, [completeStreetId])
  

  const handleOnCreated = (e) => {
    console.log(completeStreetData)
    const coordinates = e.layer._latlngs;

    changeStreetClickedPosition({
      latlng: coordinates[(coordinates.length / 2) | 0],
      streetId: "",
    });
    addCurrentStreetSectionCoordinates(e.layer._latlngs);
    const tmpStreetSectionId = uuid().slice(0, 8);

    changeCurrentCustomStreetSectionId(tmpStreetSectionId);

    const test2 = {
      ...completeStreetDataFields,
      customStreetSectionId: tmpStreetSectionId,
      coordinates: coordinates,
    };
    console.log(test2);

    const test = addCustomStreetSection(test2);

    changeShowCustomStreetSectionForm(true);
  };
  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onEdited={handleOnEdit}
        onCreated={handleOnCreated}
        onDeleted={handleOnEdit}
        draw={{
          rectangle: false,
          polygon: false,
          circle: false,
          marker: false,
          circlemarker: false,
          polyline: true,
        }}
      />
      <Circle center={[51.51, -0.06]} radius={200} />
    </FeatureGroup>
  );
};
export default MyMapDrawer;
