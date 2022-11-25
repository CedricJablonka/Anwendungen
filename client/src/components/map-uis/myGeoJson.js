import { GeoJSON } from "react-leaflet";
import { useContext, useState, useRef, useEffect } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";

const MyGeoJson = (props) => {
  const handleOnClick = (e) => {
    changeStreetClickedPosition({ latlng: e.latlng, streetId: streetId });
    setCurrentStyle(geoJsonColorMap.get(streetId));
    getStreetDetailsData(streetId);
  };

  const { data, children, streetId, style } = props;
 
  const {
    changeStreetClickedPosition,
    getStreetDetailsData,
    addGeoJsonRef,
    changeGeoJsonColor,
    geoJsonColorMap,
  } = useContext(GeneralContext);
  const [currentStyle, setCurrentStyle] = useState(
    geoJsonColorMap.get(streetId)
  );
  //save a ref of each geo json object in the general state so the geo json can be accessed from everywhere
  //for example the style of a geojson object can be changed from every other component


  return (
    <>
      <GeoJSON
        data={data}
        eventHandlers={{ click: handleOnClick }}
        style={currentStyle}
      >
        {children}
      </GeoJSON>
    </>
  );
};
export default MyGeoJson;
