import { GeoJSON } from "react-leaflet";
import { useContext } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";
import CompleteStreetContext from "../../context/complete-street-context/CompleteStreetContext";

const MyGeoJson = (props) => {
  const handleOnClick = (e) => {
    onClick(e, streetId);
  };

  const { data, children, streetId, style, onClick } = props;

  const { geoJsonColorMap } = useContext(GeneralContext);

  const { showCustomStreetSections } = useContext(CompleteStreetContext);

  const setStyle = () => {
    return geoJsonColorMap.get(streetId);
  };

  return (
    <>
      <GeoJSON
        data={data}
        eventHandlers={{ click: onClick && handleOnClick }}
        style={style ? style : setStyle}
      >
        {children}
      </GeoJSON>
    </>
  );
};
export default MyGeoJson;
