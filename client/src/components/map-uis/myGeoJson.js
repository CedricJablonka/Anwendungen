import { GeoJSON } from "react-leaflet";
import { useContext} from "react";
import GeneralContext from "../../context/general-context/GeneralContext";

const MyGeoJson = (props) => {
  //TODO make this component generic no export every specific logic
  const handleOnClick = (e) => {
    changeStreetClickedPosition({ latlng: e.latlng, streetId: streetId });
    
    getStreetDetailsData(streetId);
  };

  
  const { data, children, streetId, style } = props;
 
  const {
    changeStreetClickedPosition,
    getStreetDetailsData,
    geoJsonColorMap,
  } = useContext(GeneralContext);
 
 
  const setStyle = () =>{
    return geoJsonColorMap.get(streetId);

  }

  return (
    <>
      <GeoJSON
        data={data}
        eventHandlers={{ click: handleOnClick }}
        style={setStyle}
      >
        {children}
      </GeoJSON>
    </>
  );
};
export default MyGeoJson;
