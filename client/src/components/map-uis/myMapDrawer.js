import { FeatureGroup, Circle } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import CompleteStreetContext from "../../context/complete-street-context/CompleteStreetContext";
import GeneralContext from "../../context/general-context/GeneralContext";
import { useContext } from "react";

const MyMapDrawer = (props) => {
  const { onCreated } = props;

  const { changeStreetClickedPosition } = useContext(GeneralContext);
  const {
    addCurrentStreetSectionCoordinates,
    changeShowCustomStreetSectionForm,
  } = useContext(CompleteStreetContext);
  const handleOnEdit = (e) => {
    console.log(e.layer._latlngs);
  };

  const handleOnCreated = (e) => {
    
    const coordinates = e.layer._latlngs;
    console.log(coordinates[(coordinates.length / 2) | 0]);
    changeStreetClickedPosition({latlng: coordinates[(coordinates.length / 2) | 0], streetId: ""});
    addCurrentStreetSectionCoordinates(e.layer._latlngs);
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
