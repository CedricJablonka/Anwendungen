import { GeoJSON } from "react-leaflet";
import { useContext, useState } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";


const MyGeoJson = (props) => {
  const styleUnclicked = {};
  const styleClicked = { color: "red" };
  const [isClicked, setIsClicked] = useState(false);
  

  const handleOnClick = (e) => {
    changeStreetClickedPosition({ latlng: e.latlng, streetId: streetId });
    getStreetDetailsData(streetId);
    setIsClicked(true);
  };
  
  const { data, children, streetId, style } = props;
  const { changeStreetClickedPosition, getStreetDetailsData } = useContext(GeneralContext);
  return (
    <>
      <GeoJSON
        data={data}
        eventHandlers={{ click: handleOnClick }}
        style={style}
        
      >
        {children}
      </GeoJSON>
    </>
  );
};
export default MyGeoJson;
